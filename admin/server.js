'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const Router = require('./router');
const auth = require('./auth');
const { sendJson } = require('./utils/files');
const { handleBuild } = require('./utils/hexo-build');
const authRoutes = require('./api/auth-routes');

const PORT = 4001;
const UI_DIR = path.join(__dirname, 'ui');

// ─── MIME 类型 ────────────────────────────────────────────────────

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

// ─── 静态文件服务 ─────────────────────────────────────────────────

function serveStatic(res, filePath) {
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }
  const ext = path.extname(filePath);
  const mime = MIME[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': mime });
  fs.createReadStream(filePath).pipe(res);
}

// ─── 路由注册 ─────────────────────────────────────────────────────

const router = new Router();

// 认证路由（不需要 session）
router.post('/api/admin/auth/setup', authRoutes.handleSetup);
router.post('/api/admin/auth/login', authRoutes.handleLogin);
router.post('/api/admin/auth/logout', authRoutes.handleLogout);

// 文章路由
const articles = require('./api/articles');
router.get('/api/admin/articles', articles.list);
router.get('/api/admin/articles/:filename', articles.get);
router.post('/api/admin/articles', articles.create);
router.put('/api/admin/articles/:filename', articles.update);
router.delete('/api/admin/articles/:filename', articles.remove);

// 构建路由
router.post('/api/admin/build', (req, res) => handleBuild(req, res));

// 媒体路由
const media = require('./api/media');
router.get('/api/admin/media', media.list);
router.post('/api/admin/media/upload', media.upload);
router.delete('/api/admin/media/:filename', media.remove);

// 配置路由
const config = require('./api/config');
router.get('/api/admin/config', config.get);
router.put('/api/admin/config', config.update);

// 链接路由
const links = require('./api/links');
router.get('/api/admin/links/friends', links.getFriends);
router.put('/api/admin/links/friends', links.updateFriends);

// ─── 不需要认证的页面路径 ──────────────────────────────────────────

const PUBLIC_PAGES = ['/admin/login', '/admin/setup'];
const PUBLIC_API = ['/api/admin/auth/setup', '/api/admin/auth/login'];

// ─── 主请求处理 ───────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // 根路径重定向到 /admin/
  if (pathname === '/' || pathname === '/admin') {
    res.writeHead(302, { Location: '/admin/' });
    return res.end();
  }

  // ── 认证检查 ──────────────────────────────────────────────────
  const isPublicPage = PUBLIC_PAGES.some(p => pathname === p || pathname === p + '.html');
  const isPublicApi = PUBLIC_API.includes(pathname);
  const isApiRoute = pathname.startsWith('/api/');

  if (!isPublicPage && !isPublicApi) {
    if (!auth.isSetupDone()) {
      // 未完成初始化，所有请求跳转到 setup（API 返回 JSON）
      if (isApiRoute) {
        return sendJson(res, 403, { error: '请先完成初始化设置', redirect: '/admin/setup' });
      }
      res.writeHead(302, { Location: '/admin/setup' });
      return res.end();
    }

    if (!auth.validateSession(req.headers.cookie)) {
      if (isApiRoute) {
        return sendJson(res, 401, { error: '未登录', redirect: '/admin/login' });
      }
      res.writeHead(302, { Location: '/admin/login' });
      return res.end();
    }
  }

  // ── API 路由 ───────────────────────────────────────────────────
  if (isApiRoute) {
    return router.dispatch(req, res);
  }

  // ── 静态 UI 文件 ───────────────────────────────────────────────
  if (pathname.startsWith('/admin/')) {
    let filePath;
    const sub = pathname.slice('/admin/'.length) || 'index';

    if (sub === '' || sub === 'index' || sub === 'index.html') {
      // 默认重定向到文章列表
      res.writeHead(302, { Location: '/admin/articles' });
      return res.end();
    }

    if (path.extname(sub)) {
      filePath = path.join(UI_DIR, sub);
    } else {
      filePath = path.join(UI_DIR, sub + '.html');
    }

    return serveStatic(res, filePath);
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n管理后台已启动: http://localhost:${PORT}/admin/\n`);
  if (!auth.isSetupDone()) {
    console.log('首次使用，请访问 http://localhost:4001/admin/setup 设置密码\n');
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`端口 ${PORT} 已被占用，请关闭其他占用该端口的程序`);
  } else {
    console.error('服务器错误:', err);
  }
  process.exit(1);
});
