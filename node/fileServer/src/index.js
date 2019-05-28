
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
    let filepath = path.join(this.config.root, pathname)
    if (pathname === '/') {
      const rootPath = path.join(this.config.root, 'index.html')
      try {
        const indexStat = fs.statSync(rootPath);
        if (indexStat) {
          filepath = rootPath;
        }
      } catch (e) { }
    }

    fs.stat(filepath, (err, stats) => {
      if (err) {
        this.sendError('not found', req, res);
        return;
      }

      // 判断是否是文件夹
      // 文件夹返回文件列表
      if (stats.isDirectory) {
        let files = fs.readdirSync(filepath);
        files = files.map(file => ({
          name: file,
          url: path.join(pathname, file)
        }));
        console.log(files)
        let html = this.list()({
          title: pathname,
          files
        });
        res.setHeader("Content-Type", "text/html")
        res.end(html)
      } else {
        this.sendFile(req, res, filepath, stats);
      }

    })
  }

  // 文件列表模板渲染 返回一个函数用来接受需要渲染的数据
  list() {
    let tmpl = fs.readFileSync(path.resolve(__dirname, 'template', 'list.html'), 'utf8');
    return handlebars.compile(tmpl);
  }

  /**
    * 发送文件
    * @param {*} req 请求流
    * @param {*} res 响应流
    * @param {*} filepath 文件路径 
    * @param {*} stats 文件信息
    */
   sendFile(req, res, filepath, stats) {






    

  }

  /**
  * 错误处理
  * @param {*} err 处理信息
  * @param {*} req 请求流
  * @param {*} res 响应流
  */
  sendError(err, req, res) {
    res.statusCode = 500;
    res.end(`${err.toString()}`);
  }
}

const fileServer = new FileServer()
fileServer.start()