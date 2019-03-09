// Buffer 与字符编码
// Buffer 实例一般用于表示编码字符的序列，比如 UTF-8 、 UCS2 、 Base64 、或十六进制编码的数据。 通过使用显式的字符编码，就可以在 Buffer 实例与普通的 JavaScript 字符串之间进行相互转换。
// var buf = Buffer.from("runoob", "ascii")
// console.log(buf.toString('hex'))  //72756e6f6f62

var buf = Buffer.alloc(256)  //// 创建一个长度为 256、且用 0 填充的 Buffer。
len = buf.write("www.runoob.com")  // 返回实际写入的大小
console.log("写入字节数 : " + len)    //14

