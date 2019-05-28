// 利用connect 和中间件来构建website 
var connect = require("connect")

var server = connect.createServer() // 创建服务

// 用 use 来添加中间件
server.use(connect.static(__dirname + "/website"))

server.use(function (req, res, next) {
    console.error(' %s %s ', req.method, req.url)
    next()
})

server.listen(3000) // 监听端口