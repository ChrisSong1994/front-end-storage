const WebSocket = require('ws');  
const fs = require('fs');  
const winston = require('winston');  
const app = require('http').createServer(handler);  
const io = require('socket.io')(app);  
const wss = new WebSocket.Server({ noServer: true }, io);  
const path = require('path');  
const logger = new winston.Logger({  
  transports: [new winston.transports.File({ filename: 'video.webm' })],  
});  
  
app.on('request', (req, res) => {  
  // 处理静态文件请求，例如HTML、CSS、JavaScript等文件  
  if (req.url === '/') {  
    const indexPath = path.join(__dirname, 'index.html');  
    fs.readFile(indexPath, 'utf-8', (err, data) => {  
      if (err) {  
        res.writeHead(500);  
        res.end();  
      } else {  
        res.writeHead(200, { 'Content-Type': 'text/html' });  
        res.end(data);  
      }  
    });  
  } else {  
    res.writeHead(404);  
    res.end();  
  }  
});  
  
app.listen(8080, () => {  
  console.log('WebSocket server started on port 8080');  
});  
  
function handler (req, res) {  
  // 处理静态文件请求，例如HTML、CSS、JavaScript等文件  
  if (req.url === '/') {  
    const indexPath = path.join(__dirname, 'index.html');  
    fs.readFile(indexPath, 'utf-8', (err, data) => {  
      if (err) {  
        res.writeHead(500);  
        res.end();  
      } else {  
        res.writeHead(200, { 'Content-Type': 'text/html' });  
        res.end(data);  
      }  
    });  
  } else {  
    res.writeHead(404);  
    res.end();  
  }  
}