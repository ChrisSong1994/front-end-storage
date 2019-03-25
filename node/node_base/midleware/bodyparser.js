var connect = require("connect")

var server = connect(
    connect.bodyParser(),
    connect.static("static"),
    function (req, res, next) {
        if ("POST" == req.method) {
            console.log(rq.body.file)
        } else {
            next()
        }
    }
)

server.listen(3000)