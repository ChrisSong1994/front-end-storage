// 创建观察者数据 -- 发布者，发布消息
function Observer(data) {
  this.data = data;
  this.walk(data);
}

Observer.prototype = {
  walk: function(data) {
    debugger;
    var self = this;
    Object.keys(data).forEach(function(key) {
      self.defineReactive(data, key, data[key]); // 构建数据存取响应
    });
  },
  defineReactive: function(data, key, val) {
    var dep = new Dep();   // 为每一个可观察属性实例化一个订阅管理器
    observe(val); // 监听子属性，每个属性都有一个观察器
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get: function getter() {
        if (Dep.target) {
          // 由于需要在闭包内添加watcher，所以通过Dep定义一个全局target属性，暂存watcher, 添加完移除
          dep.addSub(Dep.target); // 当数据渲染时（数据被调用的时候搜集订阅者）
        }
        return val;
      },
      set: function setter(newVal) {
        if (newVal === val) {
          return;
        }
        val = newVal;
        dep.notify(); // 当数据被修改时给订阅者推送消息
      }
    });
  }
};

function observe(value) {
  if (!value || typeof value !== 'object') {
    return;
  }
  return new Observer(value);
}
