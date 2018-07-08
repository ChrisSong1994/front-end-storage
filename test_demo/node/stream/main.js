var fs = require("fs")

// 读取流
// var data = ""
// var readStream = fs.createReadStream('input.txt')

// readStream.setEncoding("UTF8")

// readStream.on("data", function (chunk) {  // 读取内容
//     data += chunk
// })

// readStream.on("end", function () {
//     console.log(data)
// })

// readStream.on("error", function (err) {
//     console.log(err.stack)
// })



// 写入流
// var data = "hello node！"

// var writeStream = fs.createWriteStream('output.txt')

// writeStream.write(data, 'UTF8')

// writeStream.end()

// // 处理流事件 --> data, end, and error
// writeStream.on('finish', function () {
//     console.log('写入完毕')
// })

// writeStream.on("error", function (err) {
//     console.log(err.stack)
// })



// 管道流

// var readStream = fs.createReadStream("input.txt")

// var writeStream = fs.createWriteStream("output.txt")

// readStream.pipe(writeStream)   // 会覆盖output 内容

// 链式流

var zlib = require("zlib")
// fs.createReadStream("input.txt").pipe(zlib.createGzip()).pipe(fs.createWriteStream("input.txt.gz"))

  fs.createReadStream("input.txt.gz").pipe(zlib.createGunzip()).pipe(fs.createWriteStream("input.gz.txt"))




console.log("程序执行完毕");