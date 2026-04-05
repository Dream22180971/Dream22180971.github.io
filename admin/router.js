'use strict';

const { sendJson } = require('./utils/files');

class Router {
  constructor() {
    this.routes = [];
  }

  // 注册路由：method 为 'GET'|'POST'|'PUT'|'DELETE'|'*'
  on(method, pattern, handler) {
    this.routes.push({ method: method.toUpperCase(), pattern, handler });
  }

  get(pattern, handler) { this.on('GET', pattern, handler); }
  post(pattern, handler) { this.on('POST', pattern, handler); }
  put(pattern, handler) { this.on('PUT', pattern, handler); }
  delete(pattern, handler) { this.on('DELETE', pattern, handler); }

  // 匹配路径，提取 :param，返回 params 对象或 null
  _match(pattern, pathname) {
    const patternParts = pattern.split('/');
    const pathParts = pathname.split('/');
    if (patternParts.length !== pathParts.length) return null;

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return params;
  }

  async dispatch(req, res) {
    const url = new URL(req.url, 'http://localhost');
    const pathname = url.pathname;
    const method = req.method.toUpperCase();

    for (const route of this.routes) {
      if (route.method !== '*' && route.method !== method) continue;
      const params = this._match(route.pattern, pathname);
      if (params !== null) {
        req.params = params;
        req.query = Object.fromEntries(url.searchParams);
        try {
          await route.handler(req, res);
        } catch (err) {
          console.error('[Router Error]', err);
          if (!res.headersSent) {
            sendJson(res, 500, { error: err.message || 'Internal Server Error' });
          }
        }
        return;
      }
    }

    sendJson(res, 404, { error: 'Not found' });
  }
}

module.exports = Router;
