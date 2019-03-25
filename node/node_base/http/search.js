// 一个查询客户端
var http = require("http")
var qs = require("querystring")

var search = process.argv.slice(2).join(' ').trim()  // 获取命令行输入内容
// console.log(process.argv)   //数组

if (!search.length) {
    console.log('\n usage: node search (search term)\n')
}
console.log(" \n search for: " + search)

http.request({
    host: 'www.baidu.com',
    path: "/s?" + qs.stringify({ wd: search })
}, function (res) {

    var body = ''
    res.setEncoding('utf8')

    res.on("data", function (chunk) {
        body += chunk
    })
    res.on('end', function () {
    //   var obj=JSON.parse(body)
    //   console.log(obj)
    })

}).end()

