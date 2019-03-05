var request=require("superagent")
request.get('www.baidu.com/s?').send({wd:'北京'}).end(function(data){
    console.log(data)
})