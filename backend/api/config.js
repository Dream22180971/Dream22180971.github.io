'use strict';

const fs = require('node:fs/promises');
const fsSync = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');
const { sendJson, parseBody } = require('../utils/files');

const CONFIG_PATH = path.resolve(__dirname, '..', '..', 'frontend', '_config.yml');

// 只暴露这些字段，防止意外修改危险配置
const SAFE_FIELDS = ['title', 'subtitle', 'description', 'keywords', 'author', 'language', 'timezone', 'url', 'per_page'];

async function readConfig() {
  const raw = await fs.readFile(CONFIG_PATH, 'utf-8');
  return yaml.load(raw);
}

// GET /api/admin/config
async function get(req, res) {
  try {
    const config = await readConfig();
    const safe = {};
    for (const key of SAFE_FIELDS) {
      safe[key] = config[key] !== undefined ? config[key] : '';
    }
    sendJson(res, 200, safe);
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
}

// PUT /api/admin/config
async function update(req, res) {
  let body;
  try { body = await parseBody(req); } catch (e) { return sendJson(res, 400, { error: e.message }); }

  try {
    const raw = await fs.readFile(CONFIG_PATH, 'utf-8');
    const config = yaml.load(raw);

    // 只更新安全字段
    for (const key of SAFE_FIELDS) {
      if (key in body) {
        // per_page 转数字
        if (key === 'per_page') {
          const n = parseInt(body[key], 10);
          if (!isNaN(n) && n > 0) config[key] = n;
        } else {
          config[key] = body[key];
        }
      }
    }

    const newContent = yaml.dump(config, { lineWidth: -1, indent: 2 });
    const tmpPath = CONFIG_PATH + '.tmp';
    await fs.writeFile(tmpPath, newContent, 'utf-8');
    await fs.rename(tmpPath, CONFIG_PATH);

    sendJson(res, 200, { ok: true });
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
}

module.exports = { get, update };
