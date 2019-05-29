
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

    console.log(filePath)
    fs.stat(filePath, (err, stats) => {
      if (err) {
        this.sendError('not found', req, res);
        return;
      }

      // 文件夹
      if (stats.isDirectory()) {
        let files = fs.readdirSync(filePath)
        files = files.map(file => {
          return {
            name: file,
            url: path.join(pathname, file)
          }
        })
        const html = this.list()({
          title: pathname,
          files
        })
        res.setHeader("Content-Type", 'text/html')
        res.end(html)
      }
      // 读取文件
      else {
        this.sendFile(req, res, filePath, stats)
      }
    })
  }

  /**
    * 发送文件
    * @param {*} req 请求流
    * @param {*} res 响应流
    * @param {*} filepath 文件路径 
    * @param {*} stats 文件信息
    */
  sendFile(req, res, filepath, stats) {
    // 为文件生成hash值
    const sha1 = crypto.createHash('sha1');
    const fileRS = fs.createReadStream(filepath);
    fileRS.on('data', (data) => {
      sha1.update(data);
    });

    fileRS.on('end', () => {
      const hash = sha1.digest('hex');
      // 获取文件流，并支持断点续传
      const rs = this.getStream(req, res, filepath, stats);
      // 设置content-type 并设置编码
      res.setHeader('Content-Type', mime.getType(filepath) + ';charset=utf-8');
      rs.pipe(res)
    })
  }

  /**
    * 读取文件流
    * @param {*} req 
    * @param {*} res 
    * @param {*} filepath 
    * @param {*} statObj 
    */
  getStream(req, res, filepath, statObj) {
    let start = 0;
    let end = statObj.size - 1;
    const range = req.headers['range'];
    if (range) {
      res.setHeader('Accept-Range', 'bytes');
      res.statusCode = 206;//返回整个内容的一块
      let result = range.match(/bytes=(\d*)-(\d*)/);
      if (result) {
        start = isNaN(result[1]) ? start : parseInt(result[1]);
        end = isNaN(result[2]) ? end : parseInt(result[2]) - 1;
      }
    }
    return fs.createReadStream(filepath, {
      start, end
    });

  }

  /**
   * 文件列表 :返回一个模版函数（一个对象options）
   */
  list() {
    const template = fs.readFileSync(path.resolve(__dirname, 'template', 'index.html'), 'utf-8')
    return handlebars.compile(template)
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


const fileserver = new FileServer()
fileserver.start()