'use strict';

const fs = require('node:fs/promises');
const fsSync = require('node:fs');
const path = require('node:path');
const { sendJson, parseMultipart, safePath } = require('../utils/files');

const IMG_DIR = path.resolve(__dirname, '..', '..', 'frontend', 'source', 'img');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico', '.bmp']);

async function ensureImgDir() {
  await fs.mkdir(IMG_DIR, { recursive: true });
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// GET /api/admin/media — 列出图片
async function list(req, res) {
  await ensureImgDir();
  try {
    const entries = await fs.readdir(IMG_DIR, { withFileTypes: true });
    const files = await Promise.all(
      entries
        .filter(e => e.isFile() && IMAGE_EXTS.has(path.extname(e.name).toLowerCase()))
        .map(async (e) => {
          const stat = await fs.stat(path.join(IMG_DIR, e.name));
          return {
            filename: e.name,
            url: `/img/${e.name}`,
            size: formatSize(stat.size),
            rawSize: stat.size,
            mtime: stat.mtime.toISOString(),
          };
        })
    );
    files.sort((a, b) => b.mtime.localeCompare(a.mtime));
    sendJson(res, 200, files);
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
}

// POST /api/admin/media/upload — 上传图片
async function upload(req, res) {
  await ensureImgDir();
  try {
    const parsed = await parseMultipart(req);
    if (!parsed.files.length) {
      return sendJson(res, 400, { error: '没有收到文件' });
    }

    const results = [];
    for (const file of parsed.files) {
      const ext = path.extname(file.filename).toLowerCase();
      if (!IMAGE_EXTS.has(ext)) {
        return sendJson(res, 400, { error: `不支持的文件类型：${ext}` });
      }

      // 生成安全文件名（时间戳 + 原始扩展名）
      const now = new Date();
      const pad = n => String(n).padStart(2, '0');
      const safeName = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}-${Math.random().toString(36).slice(2,6)}${ext}`;

      const filePath = path.join(IMG_DIR, safeName);
      const tmpPath = filePath + '.tmp';

      await fs.writeFile(tmpPath, file.data);
      await fs.rename(tmpPath, filePath);

      results.push({ filename: safeName, url: `/img/${safeName}`, size: formatSize(file.data.length) });
    }

    sendJson(res, 201, results);
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
}

// DELETE /api/admin/media/:filename — 删除图片
async function remove(req, res) {
  const { filename } = req.params;
  const ext = path.extname(filename).toLowerCase();
  if (!IMAGE_EXTS.has(ext)) return sendJson(res, 400, { error: '无效文件类型' });

  let filePath;
  try { filePath = safePath(IMG_DIR, filename); } catch { return sendJson(res, 403, { error: '路径非法' }); }

  try {
    await fs.unlink(filePath);
    sendJson(res, 200, { ok: true });
  } catch (e) {
    if (e.code === 'ENOENT') return sendJson(res, 404, { error: '文件不存在' });
    sendJson(res, 500, { error: e.message });
  }
}

module.exports = { list, upload, remove };
