// 创建一个完整网站服务
var http = require("http")
var fs = require("fs")

var server = http.createServer(  //创建服务
    function(req, res) {
        if ('GET' == req.method && req.url.substr(0, 7) == "/images" && req.url.substr(-4) == ".jpg") {  // 请求的url 匹配
            fs.stat(__dirname + req.url, function (err, stat) {
                if (err || !stat.isFile) {
                    res.writeHead(404)
                    res.end('not found')
                    return
                }
                serve(__dirname+req.url,"application/jpg")
            })
        }else if( "GET"==req.method && '/'==req.url){

            serve(__dirname+'/index.html',"text/html")
        }else{
            res.writeHead(404)
            res.end('not found')
        }

        function serve(path,type){  // 封装响应
            res.writeHead(200,{
                "Content-Type":type
            })
            fs.createReadStream(path).pipe(res)  // 返回了一个流
        }
    })

server.listen('3001')