const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8080;
const rootDirectory = __dirname;

const server = http.createServer((req, res) => {
    let filePath = path.join(rootDirectory, req.url);
    
    // 处理根路径
    if (filePath === path.join(rootDirectory, '/')) {
        filePath = path.join(rootDirectory, 'design-preview.html');
    }
    
    // 检查文件是否存在
    fs.exists(filePath, (exists) => {
        if (!exists) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>');
            return;
        }
        
        // 读取文件
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h1>500 Internal Server Error</h1>');
                return;
            }
            
            // 设置内容类型
            const extname = path.extname(filePath);
            let contentType = 'text/html';
            
            switch (extname) {
                case '.js':
                    contentType = 'text/javascript';
                    break;
                case '.css':
                    contentType = 'text/css';
                    break;
                case '.json':
                    contentType = 'application/json';
                    break;
                case '.png':
                    contentType = 'image/png';
                    break;
                case '.jpg':
                    contentType = 'image/jpg';
                    break;
                case '.gif':
                    contentType = 'image/gif';
                    break;
                case '.svg':
                    contentType = 'image/svg+xml';
                    break;
            }
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        });
    });
});

server.listen(port, () => {
    console.log(`静态服务器已启动: http://localhost:${port}/design-preview.html`);
    console.log(`设计预览地址: http://localhost:${port}/design-preview.html`);
});

console.log('启动静态服务器...');
