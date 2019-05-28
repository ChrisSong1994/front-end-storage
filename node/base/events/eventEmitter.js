// 事件驱动

var events = require("events")
var eventEmitter = new events.EventEmitter()  //创建 eventEmitter 对象

// 创建事件处理程序
var connectHandler = function connected() {
    console.log('连接成功。');

    // 触发 data_received 事件 
    eventEmitter.emit('data_received');
}

// 绑定 connection 事件处理程序
eventEmitter.on('connection', connectHandler);

// 使用匿名函数绑定 data_received 事件
eventEmitter.on('data_received', function () {
    console.log('数据接收成功。');
});

// 触发 connection 事件 
eventEmitter.emit('connection');