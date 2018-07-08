var events = require("events")
var eventEmitter = new events.EventEmitter()

// 监听器 #1
var listener1 = function () {
    console.log('监听器 listener1 执行。');
}

// 监听器 #2
var listener2 = function () {
    console.log('监听器 listener2 执行。');
}

// 绑定 connection 事件，处理函数为 listener1 
eventEmitter.addListener("connection", listener1)

// 绑定 connection 事件，处理函数为 listener1 
eventEmitter.on("connection", listener2)

// 输出监听其数量
var eventListeners = require("events").EventEmitter.listenerCount(eventEmitter, "connection")
console.log(eventListeners + ' 个监听器监听连接事件。')

// 处理 connection 事件 
eventEmitter.emit("connection")


// 移除监绑定的 listener1 函数
eventEmitter.removeListener("connection", listener1)
console.log("listener1 不再受监听。");

// 输出监听其数量
var eventListeners = require("events").EventEmitter.listenerCount(eventEmitter, "connection")
console.log(eventListeners + ' 个监听器监听连接事件。')

// 错误显示
eventEmitter.emit("error")