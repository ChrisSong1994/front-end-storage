var connect = require("connect")
var time = require("./middleware") // 

var server = connect.createServer(); // 开启服务

server.use(connect.logger('dev')) // 记录日志

// 实现时间中间件

server.use(time({
    time: 500
}))

console.log(time)

// 快速请求
server.use(function (req, res, next) {
    if ('/a' == req.url) {
        res.writeHead(200)
        res.end('Fast!')
    } else {
        next()
    }
})


// 慢速请求
server.use(function (req, res, next) {
    if ('/b' == req.url) {
        setTimeout(function () {
            res.writeHead(200)
            res.end('slow!')
        }, 1000)
    } else {
        next()
    }
})

server.listen(3000)