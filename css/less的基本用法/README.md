Less也是一种动态样式语言. 对CSS赋予了动态语言的特性，如变量，继承，运算， 函数.  Less 既可以在客户端上运行 (支持IE 6+, Webkit, Firefox)，也可在服务端运行 (借助 Node.js)。

### 使用方式
两种使用方式：第一种全局安装less，利用命令编译less;第二种直接引入less.js.
#### npm安装
``` 
npm install -g less 
npm install -g less-plugin-clean-css 
```

#### 命令行
``` 
lessc styles.less styles.css  // 编译成css
lessc --clean-css styles.less styles.min.css  // 编译压缩css
```

#### 引入less.js 
这里注意要在less.js引入前引入.less样式文件
```html
<link rel="stylesheet/less" href="style.less">
<script src="less.min.js"></script>
```


### 使用

#### 变量
#### 1. 值变量
less 的变量声明是以@开头
```less
/* less */
@nice-blue: #5B83AD;
@light-blue: @nice-blue + #111;

#header {
  color: @light-blue;
}
```
#### 2. 选择器变量
选择器也可使用变量,变量需要用@{}包括
```less
@mySelector: .wrap;
@{mySelector}{ //变量名 必须使用大括号包裹
  color: #999;
  width: 50%;
}
```
#### 3. 属性变量
属性名称使用变量
```less
@borderStyle: border-style;
@Soild:solid;
#wrap{
  @{borderStyle}: @Soild;//变量名 必须使用大括号包裹
}
```
#### 4. url变量
```less
@images: "../img";//需要加引号
body {
  background: url("@{images}/dog.png");//变量名 必须使用大括号包裹
}
```

#### 5. 声明变量
类似于mixins,用于引入公共代码块
- 结构: @name: { 属性: 值 ;};
- 使用：@name();
```less
// less
@background: {background:red;};
#main{
    @background();
}

// css
#main{
  background:red;
}
```

#### 6. 变量作用域
less 中变量的作用域是采用就近原则

```less
/* Less */
@var: @a;
@a: 100%;
#wrap {
  width: @var;
  @a: 9%;
}
@a: 8%;

/* 生成的 CSS */
#wrap {
  width: 9%;
}
```

#### Mixins
可以直接引入定义好的类的样式直接混入到当前
#### 1. 无参混入
``` less 
.bordered {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}
#menu a {
  color: #111;
  .bordered;  // 等价于.bordered()
}
```
#### 2. 默认参数方法
- Less 可以使用默认参数，如果 没有传参数，那么将使用默认参数。
- @arguments 犹如 JS 中的 arguments 指代的是 全部参数。
- 传的参数中 必须带着单位。
```less
.border(@a:10px,@b:50px,@c:30px,@color:#000){
    border:solid 1px @color;
    box-shadow: @arguments;//指代的是 全部参数
}
#main{
    .border(0px,5px,30px,red);//必须带着单位
}
```

#### 条件语句when
Less 没有 if else，它有 when用于做条件判断
```less
/* Less */
#card{
    
    // and 运算符 ，相当于 与运算 &&，必须条件全部符合才会执行
    .border(@width,@color,@style) when (@width>100px) and(@color=#999){
        border:@style @color @width;
    }

    // not 运算符，相当于 非运算 !，条件为 不符合才会执行
    .background(@color) when not (@color>=#222){
        background:@color;
    }

    // , 逗号分隔符：相当于 或运算 ||，只要有一个符合条件就会执行
    .font(@size:20px) when (@size>50px) , (@size<100px){
        font-size: @size;
    }
}
#main{
    #card>.border(200px,#999,solid);
    #card .background(#111);
    #card > .font(40px);
}
/* 生成后的 CSS */
#main{
  border:solid #999 200px;
  background:#111;
  font-size:40px;
}
```

####  嵌套
less 支持嵌套写法
#### 1. 基本层级嵌套
```less
#header {
  color: black;
  .navigation {
    font-size: 12px;
  }
  .logo {
    width: 300px;
  }
}
```
#### 2. 父选择&符
```less
a {
  color: blue;
  &:hover {
    color: green;
  }
}
```
#### 3. 嵌套指令冒泡
```less
// less
.screen-color {
  @media screen {
    color: green;
    @media (min-width: 768px) {
      color: red;
    }
  }
}

/* css */
@media screen {
  .screen-color {
    color: green;
  }
}
@media screen and (min-width: 768px) {
  .screen-color {
    color: red;
  }
}
```

#### 运算符
```less
@base: 5%;
@filler: @base * 2; // result is 10%
@other: @base + @filler; // result is 15%
```

### 继承
extend 是 Less 的一个伪类。它可继承 所匹配声明中的全部样式
#### 1. extend 关键字的使用
```less
/* Less */
.animation{
    transition: all .3s ease-out;
    .hide{
      transform:scale(0);
    }
}
#main{
    &:extend(.animation);
}
#con{
    &:extend(.animation .hide);
}

/*  CSS */
.animation,#main{
  transition: all .3s ease-out;
}
.animation .hide , #con{
    transform:scale(0);
}
```

#### 2. all 全局搜索替换
使用选择器匹配到的 全部声明
```less
/* Less */
#main{
  width: 200px;
}
#main {
  &:after {
    content:"Less is good!";
  }
}
#wrap:extend(#main all) {}

/*  CSS */
#main,#wrap{
  width: 200px;
}
#main:after, #wrap:after {
    content: "Less is good!";
}
```

### 导入
#### 1. 导入 less 文件 可省略后缀
```less
import "main"; 
//等价于
import "main.less";
```

#### 2. @import 的位置可随意放置
```less
#main{
  font-size:15px;
}
@import "style";
```

#### 3. reference
使用@import (reference)导入外部文件，但不会添加 把导入的文件 编译到最终输出中，只引用。
```less
/* Less */
@import (reference) "bootstrap.less"; 

#wrap:extend(.navbar all){}
```

### 函数
less 提供多种函数可以使用
#### 1. 判断类型
```less 
isnumber(#ff0);     // 判断给定的值 是否 是一个数字
iscolor(#ccc)      //判断给定的值 是否 是一个颜色
isurl("")         // 判断给定的值 是否 是一个 url
```
#### 2. 颜色操作
```less 
rgb(90, 129, 32)   //  #5a8120
mix(#ff0000, #0000ff, 50%)   // #800080
hsl(90, 100%, 50%)   // #80ff00 
argb(rgba(90, 23, 148, 0.5)) // #805a1794
darken(hsl(90, 80%, 50%), 20%)  // #4d8a0f
```

#### 3. 数学函数
```less
ceil(2.4)  // 3  
floor(2.6)  // 2
percentage(0.5) // 50%
round(1.67, 1) // 1.7
sqrt(25cm)   // 5cm
abs(-18.6%)  // 18.6%
```

### 其他

#### 注释
``` less 
/* */ CSS原生注释，会被编译在 CSS 文件中。
/   / Less提供的一种注释，不会被编译在 CSS 文件中
```

#### 避免编译
使用  ~' 值 '  结构可以避免被编译
- 结构： ~' 值 '
```less 
/* Less */
#main{
  width:~'calc(300px-30px)';
}

/*  CSS */
#main{
  width:calc(300px-30px);
}
```

#### 变量拼串
在平时工作中，这种需求 太常见了。 在下面例子中， 实现了不同的 transtion-delay、animation、@keyframes
- 结构： ~"字符@{变量}字符";
```less 
.judge(@i) when(@i=1){
  @size:15px;
}
.judge(@i) when(@i>1){
  @size:16px;
}
.loopAnimation(@i) when (@i<16) {
  
  .circle:nth-child(@{i}){
      .judeg(@i);
      border-radius:@size @size 0 0;
      animation: ~"circle-@{i}" @duration infinite @ease;
      transition-delay:~"@{i}ms";
  }
  @keyframes ~"circle-@{i}" {
      // do something...
  }
  .loopAnimation(@i + 1);
}
```

#### 使用 JS
因为 Less 是由 JS 编写，所以 Less 有一得天独厚的特性：代码中使用 Javascript 
```less 
/* Less */
@content:`"aaa".toUpperCase()`;
#randomColor{
  @randomColor: ~"rgb(`Math.round(Math.random() * 256)`,`Math.round(Math.random() * 256)`,`Math.round(Math.random() * 256)`)";
}
#wrap{
  width: ~"`Math.round(Math.random() * 100)`px";
  &:after{
      content:@content;
  }
  height: ~"`window.innerHeight`px";
  alert:~"`alert(1)`";
  #randomColor();
  background-color: @randomColor;
}
/* 生成后的 CSS */

// 弹出 1
#wrap{
  width: 随机值（0~100）px;
  height: 743px;//由电脑而异
  background: 随机颜色;
}
#wrap::after{
  content:"AAA";
}
```

 *参考：* [学习Less-看这篇就够了](https://juejin.im/post/5a2bc28f6fb9a044fe464b19#heading-9)