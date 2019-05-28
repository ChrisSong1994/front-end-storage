
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const mime = require('mime');
const crypto = require('crypto');
const zlib = require('zlib');



class FileServer {
  constructor() {
    this.config = {
      port: 8080,
      root: process.cwd()
    }
  }

  // 启动服务
  start() {
    const server = http.createServer()
    server.on('request', this.request.bind(this))
    server.listen(this.config.port, () => {
      console.log(`静态文件服务启动成功, 访问localhost:${this.config.port}`);
    })
  }

  //  请求处理
  request(req, res) {
    const { pathname } = url.parse(req.url)
    const filePath = path.join(this.config.root, pathname)




  }
}
