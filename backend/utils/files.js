'use strict';

const path = require('node:path');

// 发送 JSON 响应
function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

// 读取请求体并解析为 JSON
function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > 1024 * 1024) { // 1MB 限制
        reject(new Error('Request body too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf-8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

// 解析 multipart/form-data，返回 { fields: {}, files: [{name, filename, mime, data}] }
function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers['content-type'] || '';
    const match = contentType.match(/boundary=([^\s;]+)/);
    if (!match) return reject(new Error('No boundary found'));

    const boundary = match[1];
    const chunks = [];
    let size = 0;
    const MAX = 10 * 1024 * 1024; // 10MB

    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX) {
        reject(new Error('Upload too large (max 10MB)'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      try {
        const body = Buffer.concat(chunks);
        const result = { fields: {}, files: [] };
        const delimBuf = Buffer.from('\r\n--' + boundary);
        const startBuf = Buffer.from('--' + boundary);

        // 找各 part 的起止位置
        const parts = [];
        let pos = startBuf.length + 2; // 跳过首行 boundary + CRLF

        while (pos < body.length) {
          const next = indexOfBuf(body, delimBuf, pos);
          if (next === -1) break;
          parts.push(body.slice(pos, next));
          pos = next + delimBuf.length;
          if (body[pos] === 0x2d && body[pos + 1] === 0x2d) break; // --boundary--
          pos += 2; // CRLF after boundary
        }

        for (const part of parts) {
          const headerEnd = indexOfBuf(part, Buffer.from('\r\n\r\n'), 0);
          if (headerEnd === -1) continue;
          const headerStr = part.slice(0, headerEnd).toString('utf-8');
          const data = part.slice(headerEnd + 4);

          const dispMatch = headerStr.match(/Content-Disposition:.*?name="([^"]+)"/i);
          const fileMatch = headerStr.match(/filename="([^"]*)"/i);
          const mimeMatch = headerStr.match(/Content-Type:\s*([^\r\n]+)/i);
          if (!dispMatch) continue;

          const fieldName = dispMatch[1];
          if (fileMatch) {
            result.files.push({
              name: fieldName,
              filename: fileMatch[1],
              mime: mimeMatch ? mimeMatch[1].trim() : 'application/octet-stream',
              data,
            });
          } else {
            result.fields[fieldName] = data.toString('utf-8');
          }
        }

        resolve(result);
      } catch (e) {
        reject(e);
      }
    });

    req.on('error', reject);
  });
}

// Buffer 内查找子 Buffer 的位置
function indexOfBuf(haystack, needle, start = 0) {
  for (let i = start; i <= haystack.length - needle.length; i++) {
    let found = true;
    for (let j = 0; j < needle.length; j++) {
      if (haystack[i + j] !== needle[j]) { found = false; break; }
    }
    if (found) return i;
  }
  return -1;
}

// 安全路径检查：确保 filePath 在 baseDir 内
function safePath(baseDir, ...parts) {
  const resolved = path.resolve(baseDir, ...parts);
  if (!resolved.startsWith(path.resolve(baseDir))) {
    throw new Error('Path traversal detected');
  }
  return resolved;
}

module.exports = { sendJson, parseBody, parseMultipart, safePath };
