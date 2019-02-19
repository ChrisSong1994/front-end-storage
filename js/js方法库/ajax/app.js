const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const path = require("path");
const static = require("koa-static");

const app = new Koa();
const router = new Router();
const staticPath = "./static";

router.get("/ajax/get", ctx => {
  const params = ctx.query;
  // 接口返回结果
  ctx.body = {
    success: "succcess",
    message: "请求成功！",
    params: params,
    data: "这是一个get请求"
  };
});

router.post("/ajax/post", ctx => {
  const params = ctx.request.body;
  console.log(params)
  // 接口返回结果
  ctx.body = {
    success: "succcess",
    message: "请求成功！",
    params:params,
    data: "这是一个post请求"
  };
});

router.get("/ajax/jsonp", ctx => {
  const params = ctx.query;
  const callback = params.callback;
  const responseData={
    success: "succcess",
    message: "请求成功！",
    params: params,
    data: "这是一个支持jsonp的请求！"
  };
  // 接口返回结果
  if (callback) {
    ctx.body=`${callback}(${JSON.stringify(responseData)})`
  } else {
    throw console.error("未配置callback函数！");
    
  }
});

app.use(bodyParser());
app.use(router.routes());
app.use(static(path.join(__dirname, staticPath)));
app.listen(9000);
