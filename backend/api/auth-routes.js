'use strict';

const { sendJson, parseBody } = require('../utils/files');
const auth = require('../auth');

async function handleSetup(req, res) {
  if (req.method === 'POST') {
    const body = await parseBody(req);
    const { password } = body;
    if (!password || password.length < 6) {
      return sendJson(res, 400, { error: '密码至少6位' });
    }
    if (auth.isSetupDone()) {
      return sendJson(res, 403, { error: '已完成初始化，不能重复设置' });
    }
    auth.setupPassword(password);
    return sendJson(res, 200, { ok: true });
  }
  sendJson(res, 405, { error: 'Method Not Allowed' });
}

async function handleLogin(req, res) {
  if (req.method === 'POST') {
    const body = await parseBody(req);
    const { password } = body;
    if (!auth.verifyPassword(password)) {
      return sendJson(res, 401, { error: '密码错误' });
    }
    const { cookieHeader } = auth.createSession();
    res.setHeader('Set-Cookie', cookieHeader);
    return sendJson(res, 200, { ok: true });
  }
  sendJson(res, 405, { error: 'Method Not Allowed' });
}

async function handleLogout(req, res) {
  auth.destroySession(req.headers.cookie);
  res.setHeader('Set-Cookie', `${auth.COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`);
  return sendJson(res, 200, { ok: true });
}

module.exports = { handleSetup, handleLogin, handleLogout };
