const Koa = require('koa');
const WebSocket = require('ws');
const static=require("koa-static")
const path = require("path");
const staticPath = "./";

const app = new Koa();
const ws = new WebSocket.Server({port: 8888});

ws.on('connection', ws => {
    console.log('server connection');

    ws.on('message', msg => {
      console.log('server receive msg：', msg);
      ws.send('Information from the server');
    });

    ws.send('Information from the server');
});

app.use(static(path.join(__dirname, staticPath)));
app.listen(3000);
