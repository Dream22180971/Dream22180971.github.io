const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  let filePath = '.' + decodeURI(req.url);
  if (filePath === './') {
    filePath = './index.html';
  }
  
  let extname = path.extname(filePath);
  if (!extname) {
    if (filePath.endsWith('/')) {
      filePath += 'index.html';
    } else {
      filePath += '.html';
    }
    extname = '.html';
  }
  
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found, serve 404
        fs.readFile('./404.html', (error, content) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`, 'utf-8');
      }
    } else {
      // Success with caching headers
      const headers = { 'Content-Type': contentType };
      
      // Set cache headers based on file type
      if (extname === '.html') {
        // HTML files: no-cache (revalidate on every request)
        headers['Cache-Control'] = 'no-cache, must-revalidate';
        headers['Expires'] = new Date().toUTCString();
      } else {
        // Static assets: cache for 7 days
        headers['Cache-Control'] = 'public, max-age=604800';
        const oneWeekLater = new Date();
        oneWeekLater.setDate(oneWeekLater.getDate() + 7);
        headers['Expires'] = oneWeekLater.toUTCString();
      }
      
      res.writeHead(200, headers);
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});