'use strict';

const { spawn } = require('node:child_process');
const path = require('node:path');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

// 运行 hexo generate，通过 SSE 流式输出日志
// onData(line: string)，onClose(code: number)
function runHexoGenerate(onData, onClose) {
  const hexoBin = path.join(PROJECT_ROOT, 'node_modules', '.bin', 'hexo');
  const child = spawn('node', [hexoBin, 'generate'], {
    cwd: PROJECT_ROOT,
    shell: false,
  });

  child.stdout.on('data', (chunk) => {
    const lines = chunk.toString('utf-8').split('\n');
    for (const line of lines) {
      if (line.trim()) onData(line);
    }
  });

  child.stderr.on('data', (chunk) => {
    const lines = chunk.toString('utf-8').split('\n');
    for (const line of lines) {
      if (line.trim()) onData('[stderr] ' + line);
    }
  });

  child.on('close', (code) => {
    onClose(code);
  });

  return child;
}

// HTTP handler：将 hexo generate 输出作为 SSE 流发送
function handleBuild(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const send = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  send({ type: 'start', message: '开始执行 hexo generate...' });

  runHexoGenerate(
    (line) => send({ type: 'log', message: line }),
    (code) => {
      send({ type: 'done', code, message: code === 0 ? '生成完成！' : `生成失败，退出码：${code}` });
      res.end();
    }
  );
}

module.exports = { runHexoGenerate, handleBuild };
