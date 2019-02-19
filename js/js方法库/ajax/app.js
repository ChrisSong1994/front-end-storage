const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const path = require("path");
const static = require("koa-static");

const app = new Koa();
const router = new Router();
const staticPath = "./static";

router.get("/ajax/get", ctx => {
  const params = ctx.params;
  // 接口返回结果
  ctx.body = {
    success: "succcess",
    message: "请求成功！",
    params:params,
    data: "这是一个get请求"
  };
});

router.get("/ajax/jsonp", ctx => {
  const params = ctx.params;
  // 接口返回结果
  ctx.body = {
    success: "succcess",
    message: "请求成功！",
    data: "这是一个支持jsonp的请求！"
  };
});

app.use(bodyParser());
app.use(router.routes());
app.use(static(path.join(__dirname, staticPath)));
app.listen(9000);
