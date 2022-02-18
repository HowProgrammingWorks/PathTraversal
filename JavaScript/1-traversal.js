'use strict';

// Use curl after run this file:
// curl -v http://127.0.0.1:8000/%2e%2e/1-traversal.js

const fs = require('fs');
const http = require('http');
const path = require('path');

const PORT = 8000;

const MIME_TYPES = {
  default: 'application/octet-stream',
  html: 'text/html; charset=UTF-8',
  js: 'application/javascript; charset=UTF-8',
  json: 'application/json',
  css: 'text/css',
  png: 'image/png',
  jpg: 'image/jpg',
  gif: 'image/gif',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
};

const STATIC_PATH = path.join(process.cwd(), './static');

const toBool = [() => true, () => false];

const prepareFile = async (url) => {
  const name = url === '/' ? '/index.html' : url;
  const filePath = path.join(STATIC_PATH, name);
  console.log(`Serve: ${url} from ${filePath}`);
  const found = await fs.promises.access(filePath).then(...toBool);
  const ext = path.extname(filePath).substring(1).toLowerCase();
  const stream = fs.createReadStream(filePath);
  return { found, ext, stream };
};

http.createServer(async (req, res) => {
  const file = await prepareFile(decodeURI(req.url));
  const statusCode = file.found ? 200 : 404;
  const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
  res.writeHead(statusCode, { 'Content-Type': mimeType });
  file.stream.pipe(res);
  console.log(`${req.method} ${req.url} ${statusCode}`);
}).listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);
