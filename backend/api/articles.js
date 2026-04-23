'use strict';

const fs = require('node:fs/promises');
const fsSync = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');
const fm = require('hexo-front-matter');

const { sendJson, parseBody, safePath } = require('../utils/files');

const POSTS_DIR = path.resolve(__dirname, '..', '..', 'frontend', 'source', '_posts');

// 确保目录存在
async function ensurePostsDir() {
  await fs.mkdir(POSTS_DIR, { recursive: true });
}

// 解析前言和内容
function parsePost(raw) {
  try {
    const parsed = fm.parse(raw);
    const { _content, ...frontMatter } = parsed;
    return { frontMatter, content: _content || '' };
  } catch {
    return { frontMatter: {}, content: raw };
  }
}

// 序列化为 .md 文件
function serializePost(frontMatter, content) {
  const fm = { ...frontMatter };
  // 格式化日期
  if (fm.date instanceof Date) {
    fm.date = fm.date.toISOString().replace('T', ' ').slice(0, 19);
  }
  return '---\n' + yaml.dump(fm, { lineWidth: -1 }) + '---\n\n' + (content || '');
}

// 生成文件名（时间戳，避免中文路径问题）
function generateFilename() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.md`;
}

// GET /api/admin/articles — 列出所有文章
async function list(req, res) {
  await ensurePostsDir();
  let files;
  try {
    files = await fs.readdir(POSTS_DIR);
  } catch {
    return sendJson(res, 500, { error: '无法读取文章目录' });
  }

  const mdFiles = files.filter(f => f.endsWith('.md'));
  const articles = await Promise.all(mdFiles.map(async (filename) => {
    try {
      const raw = await fs.readFile(path.join(POSTS_DIR, filename), 'utf-8');
      const { frontMatter } = parsePost(raw);
      return {
        filename,
        title: frontMatter.title || filename.replace(/\.md$/, ''),
        date: frontMatter.date || '',
        categories: [].concat(frontMatter.categories || []),
        tags: [].concat(frontMatter.tags || []),
      };
    } catch {
      return { filename, title: filename, date: '', categories: [], tags: [] };
    }
  }));

  // 按日期倒序
  articles.sort((a, b) => (b.date > a.date ? 1 : -1));
  sendJson(res, 200, articles);
}

// GET /api/admin/articles/:filename — 读取单篇
async function get(req, res) {
  const { filename } = req.params;
  if (!filename.endsWith('.md')) return sendJson(res, 400, { error: '无效文件名' });

  let filePath;
  try {
    filePath = safePath(POSTS_DIR, filename);
  } catch {
    return sendJson(res, 403, { error: '路径非法' });
  }

  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const { frontMatter, content } = parsePost(raw);
    sendJson(res, 200, { filename, frontMatter, content });
  } catch (e) {
    if (e.code === 'ENOENT') return sendJson(res, 404, { error: '文章不存在' });
    sendJson(res, 500, { error: e.message });
  }
}

// POST /api/admin/articles — 新建文章
async function create(req, res) {
  await ensurePostsDir();
  let body;
  try { body = await parseBody(req); } catch (e) { return sendJson(res, 400, { error: e.message }); }

  const { title, date, categories, tags, content } = body;
  const frontMatter = {
    title: title || '新文章',
    date: date || new Date().toISOString().replace('T', ' ').slice(0, 19),
    categories: Array.isArray(categories) ? categories : (categories ? [categories] : []),
    tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
  };

  const filename = generateFilename();
  const filePath = path.join(POSTS_DIR, filename);
  const fileContent = serializePost(frontMatter, content || '');

  // 写 tmp 再 rename
  const tmpPath = filePath + '.tmp';
  try {
    await fs.writeFile(tmpPath, fileContent, 'utf-8');
    await fs.rename(tmpPath, filePath);
    sendJson(res, 201, { filename, frontMatter });
  } catch (e) {
    try { await fs.unlink(tmpPath); } catch {}
    sendJson(res, 500, { error: e.message });
  }
}

// PUT /api/admin/articles/:filename — 更新文章
async function update(req, res) {
  const { filename } = req.params;
  if (!filename.endsWith('.md')) return sendJson(res, 400, { error: '无效文件名' });

  let filePath;
  try { filePath = safePath(POSTS_DIR, filename); } catch { return sendJson(res, 403, { error: '路径非法' }); }

  if (!fsSync.existsSync(filePath)) return sendJson(res, 404, { error: '文章不存在' });

  let body;
  try { body = await parseBody(req); } catch (e) { return sendJson(res, 400, { error: e.message }); }

  const { title, date, categories, tags, content } = body;
  const frontMatter = {
    title: title || '',
    date: date || '',
    categories: Array.isArray(categories) ? categories : (categories ? [categories] : []),
    tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
  };

  const fileContent = serializePost(frontMatter, content || '');
  const tmpPath = filePath + '.tmp';
  try {
    await fs.writeFile(tmpPath, fileContent, 'utf-8');
    await fs.rename(tmpPath, filePath);
    sendJson(res, 200, { filename, frontMatter });
  } catch (e) {
    try { await fs.unlink(tmpPath); } catch {}
    sendJson(res, 500, { error: e.message });
  }
}

// DELETE /api/admin/articles/:filename — 删除文章
async function remove(req, res) {
  const { filename } = req.params;
  if (!filename.endsWith('.md')) return sendJson(res, 400, { error: '无效文件名' });

  let filePath;
  try { filePath = safePath(POSTS_DIR, filename); } catch { return sendJson(res, 403, { error: '路径非法' }); }

  try {
    await fs.unlink(filePath);
    sendJson(res, 200, { ok: true });
  } catch (e) {
    if (e.code === 'ENOENT') return sendJson(res, 404, { error: '文章不存在' });
    sendJson(res, 500, { error: e.message });
  }
}

module.exports = { list, get, create, update, remove };
