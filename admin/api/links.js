'use strict';

const fs = require('node:fs/promises');
const fsSync = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');
const { sendJson, parseBody } = require('../utils/files');

const DATA_DIR = path.resolve(__dirname, '..', '..', 'source', '_data');
const FRIENDS_PATH = path.join(DATA_DIR, 'links.yml');

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

// GET /api/admin/links/friends
async function getFriends(req, res) {
  await ensureDataDir();
  try {
    if (!fsSync.existsSync(FRIENDS_PATH)) {
      return sendJson(res, 200, []);
    }
    const raw = await fs.readFile(FRIENDS_PATH, 'utf-8');
    const data = yaml.load(raw) || [];
    sendJson(res, 200, Array.isArray(data) ? data : []);
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
}

// PUT /api/admin/links/friends
async function updateFriends(req, res) {
  let body;
  try { body = await parseBody(req); } catch (e) { return sendJson(res, 400, { error: e.message }); }

  if (!Array.isArray(body)) {
    return sendJson(res, 400, { error: '数据格式应为数组' });
  }

  // 验证每个条目
  const links = body.map(item => ({
    name: String(item.name || '').trim(),
    url: String(item.url || '').trim(),
    avatar: String(item.avatar || '').trim(),
    description: String(item.description || '').trim(),
  })).filter(item => item.name && item.url);

  try {
    await ensureDataDir();
    const content = yaml.dump(links, { lineWidth: -1, allowUnicode: true });
    const tmpPath = FRIENDS_PATH + '.tmp';
    await fs.writeFile(tmpPath, content, 'utf-8');
    await fs.rename(tmpPath, FRIENDS_PATH);
    sendJson(res, 200, { ok: true, count: links.length });
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
}

module.exports = { getFriends, updateFriends };
