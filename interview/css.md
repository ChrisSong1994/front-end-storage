#### 1. 介绍一下标准的CSS的盒子模型？与低版本IE的盒子模型有什么不同的？
```
 标准盒子模型：宽度=内容的宽度（content）+ border + padding + margin
 低版本IE盒子模型：宽度=内容宽度（content+border+padding）+ margin
```


####  2. box-sizing属性？
```
用来控制元素的盒子模型的解析模式，默认为content-box
context-box：W3C的标准盒子模型，设置元素的 height/width 属性指的是content部分的高/宽
border-box：IE传统盒子模型。设置元素的height/width属性指的是border + padding + content部分的高/宽
```

#### 3. CSS选择器有哪些？哪些属性可以继承？
```
CSS选择符：id选择器(#myid)、类选择器(.myclassname)、标签选择器(div, h1, p)、相邻选择器(h1 + p)、子选择器（ul > li）、后代选择器（li a）、通配符选择器（*）、属性选择器（a[rel=”external”]）、伪类选择器（a:hover, li:nth-child）
可继承的属性：font-size, font-family, color
不可继承的样式：border, padding, margin, width, height
优先级（就近原则）：!important > [ id > class > tag ]
!important 比内联优先级高
```