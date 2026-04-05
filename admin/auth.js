'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const ENV_PATH = path.resolve(__dirname, '..', '.env');
const COOKIE_NAME = 'admin_session';
const SESSION_TTL = 24 * 60 * 60 * 1000; // 24小时

// 内存 session 存储：token -> { expires }
const sessions = new Map();

// ─── .env 读写 ───────────────────────────────────────────────────

function readEnv() {
  if (!fs.existsSync(ENV_PATH)) return {};
  const lines = fs.readFileSync(ENV_PATH, 'utf-8').split('\n');
  const env = {};
  for (const line of lines) {
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim();
  }
  return env;
}

function writeEnv(data) {
  const lines = Object.entries(data).map(([k, v]) => `${k}=${v}`);
  fs.writeFileSync(ENV_PATH, lines.join('\n') + '\n', 'utf-8');
}

// ─── 初始化检查 ───────────────────────────────────────────────────

function isSetupDone() {
  if (!fs.existsSync(ENV_PATH)) return false;
  const env = readEnv();
  return !!(env.PASSWORD_HASH && env.SESSION_SECRET);
}

// ─── 密码管理 ─────────────────────────────────────────────────────

function hashPassword(plaintext) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(plaintext, salt, 10000, 32, 'sha256').toString('hex');
  return `pbkdf2:sha256:10000:${salt}:${hash}`;
}

function verifyPassword(plaintext) {
  const env = readEnv();
  const stored = env.PASSWORD_HASH;
  if (!stored) return false;

  const parts = stored.split(':');
  if (parts.length !== 5 || parts[0] !== 'pbkdf2') return false;
  const [, , iters, salt, expectedHash] = parts;

  const actualHash = crypto.pbkdf2Sync(
    plaintext, salt, parseInt(iters, 10), 32, 'sha256'
  ).toString('hex');

  return crypto.timingSafeEqual(
    Buffer.from(actualHash, 'hex'),
    Buffer.from(expectedHash, 'hex')
  );
}

function setupPassword(plaintext) {
  const passwordHash = hashPassword(plaintext);
  const sessionSecret = crypto.randomBytes(32).toString('hex');
  writeEnv({ PASSWORD_HASH: passwordHash, SESSION_SECRET: sessionSecret });
}

// ─── Session 管理 ─────────────────────────────────────────────────

function getSessionSecret() {
  return readEnv().SESSION_SECRET || '';
}

function signToken(token) {
  const secret = getSessionSecret();
  return crypto.createHmac('sha256', secret).update(token).digest('hex');
}

function createSession() {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = Date.now() + SESSION_TTL;
  sessions.set(token, { expires });

  const signature = signToken(token);
  const cookieValue = `${token}.${signature}`;
  return {
    token,
    cookieHeader: `${COOKIE_NAME}=${cookieValue}; HttpOnly; SameSite=Strict; Path=/`,
  };
}

function validateSession(cookieHeader) {
  if (!cookieHeader) return false;

  // 解析 cookie
  const cookies = {};
  for (const part of cookieHeader.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    cookies[k.trim()] = rest.join('=');
  }

  const cookieValue = cookies[COOKIE_NAME];
  if (!cookieValue) return false;

  const dotIdx = cookieValue.lastIndexOf('.');
  if (dotIdx === -1) return false;
  const token = cookieValue.slice(0, dotIdx);
  const sig = cookieValue.slice(dotIdx + 1);

  // 验证签名
  const expectedSig = signToken(token);
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expectedSig, 'hex'))) {
      return false;
    }
  } catch {
    return false;
  }

  // 检查过期
  const session = sessions.get(token);
  if (!session || session.expires < Date.now()) {
    sessions.delete(token);
    return false;
  }

  return true;
}

function getTokenFromCookie(cookieHeader) {
  if (!cookieHeader) return null;
  const cookies = {};
  for (const part of cookieHeader.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    cookies[k.trim()] = rest.join('=');
  }
  const cookieValue = cookies[COOKIE_NAME];
  if (!cookieValue) return null;
  return cookieValue.split('.')[0];
}

function destroySession(cookieHeader) {
  const token = getTokenFromCookie(cookieHeader);
  if (token) sessions.delete(token);
}

// 定期清理过期 session（每小时）
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of sessions) {
    if (session.expires < now) sessions.delete(token);
  }
}, 60 * 60 * 1000);

module.exports = {
  isSetupDone,
  setupPassword,
  verifyPassword,
  createSession,
  validateSession,
  destroySession,
  COOKIE_NAME,
};
