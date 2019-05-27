### webpack 依赖管理
> webpack是一个模块管理器,可以管理模块的依赖关系，并产生可以替代这些模块的静态代码

#### 带表达式的 require 语句
> 如果你的 request 含有表达式(expressions)，会创建一个上下文(context)，因为在编译时(compile time)并不清楚具体是哪一个模块被导入。
> 示例：
``` require("./template/" + name + ".ejs"); ```

- webpack 解析 require() 的调用，提取出来如下这些信息：

```
Directory: ./template
Regular expression: /^.*\.ejs$/
```
- 具有上下文的模块

（译者注：这里的 request 应该是指在 require() 语句中的表达式，如 "./template/" + name + ".ejs"）生成一个具有上下文的模块。它包含目录下的所有模块的引用(reference)，这些模块能够「通过从 request 匹配出来的正则表达式」所 require 进来。上下文模块包含一个 map 对象，会把 request 中所有模块转译成对应的模块 id。

- 示例：
```
{
    "./table.ejs": 42,
    "./table-row.ejs": 43,
    "./directory/folder.ejs": 44
}
```
上下文模块还包含一些运行时(runtime)逻辑来访问这个 map 对象。
这意味着 webpack 能够支持动态 require，但会导致所有可能用到的模块都包含在 bundle 中。

#### require.context 返回的一个

> 你还可以使用 require.context() 方法来创建自己的（模块）上下文。

你可以给这个方法传 3 个参数：要搜索的文件夹目录，是否还应该搜索它的子目录，以及一个匹配文件的正则表达式。
webpack 会在构建的时候解析代码中的 require.context() 。

- 语法如下：
``` javascript
require.context(directory, useSubdirectories = false, regExp = /^\.\//)
 ```
- 示例：
```javascript
require.context('./pages/', true, /\.js$/)
```
> __传递给 require.context 的参数必须是字面量(literal)！__

#### 上下文模块 API 
一个上下文模块导出一个（require）函数，这个函数可以接收一个参数：request。
导出的方法有 3 个属性： resolve, keys, id。

- resolve 是一个函数，它返回请求被解析后得到的模块 id。
- keys 也是一个函数，它返回一个数组，由所有可能被上下文模块处理的请求。

>  上下文模块源码如下
```javascript
var map = {
	"./Home/index.js": "./src/pages/Home/index.js",
	"./Layout/Head/index.js": "./src/pages/Layout/Head/index.js"
};

function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
webpackContext.id = "./src/pages sync recursive \\.js$";

module.exports = webpackContext;
```
