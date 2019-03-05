var connect = require("connect")
var users = require("./users")

var server = connect(
    connect.logger("dev"), connect.bodyParser(), connect.cookieParser(), connect.session({
        secret: "my app secret"
    }),
    function (req, res, next) {
        if ("/" == req.url && req.session.logged_in) {
            res.writeHead(200, {
                'Content-Type': "text/html"
            })
            console.log(req.session)
            res.end('welcome back,<b>' + req.session.name + '</b>' +
                ' <a href="/logout">logout</a>')
        } else {
            next()
        }
    },
    function (req, res, next) {
        if ("/" == req.url && "GET" == req.method) {
            res.writeHead(200, {
                'Content-Type': "text/html"
            })
            res.end([
                ' <form action="/login" method="POST">',
                '<fildset>',
                ' <legend>plase log in </legend>',
                ' <p>user: <input type="text" name="user" id=""></p>',
                ' <p>password: <input type="password" name="password" id=""></p>',
                ' <button>submit</button>',
                '  </fildset>',
                '</form>'
            ].join(''));
        } else {
            next()
        }
    },
    function (req, res, next) {
        if ("/login" == req.url && "POST" == req.method) {
            res.writeHead(200);
            if (!users[req.body.user] || req.body.password != users[req.body.user].password) {
                res.end('bad username/passwod');

            } else {
                req.session.logged_in = true;
                req.session.name = users[req.body.user].name;
                res.end('authenticated!');
            }
        }else{
            next()
        }
    },
    function(req,res,next){
        if('/logout'==req.url){
            req.session.logged_in = false;
            res.writeHead(200)
            res.end("logout!")

        }else{
            next()
        }
    }
)

server.listen(3000)