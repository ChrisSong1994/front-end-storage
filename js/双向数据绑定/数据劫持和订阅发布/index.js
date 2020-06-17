function MyVue(options) {
  const self = this;
  this.data = options.data; // data
  this.el = options.el; // 挂在的dom节点
  this.methods = options.methods; // 方法集

  debugger;
  // data  数据映射到 vm 上
  Object.keys(this.data).forEach(function (key) {
    self.proxyKeys(key);
  });
  debugger;

  // 对数据进行观察
  observe(this.data);

  debugger;
  // 解析模板指令
  new Compile(this.el, this);

  // 执行钩子函数
  options.mounted.call(this); // 执行完成运行mounted
}

// 目的是把数据代理到vm 实例上，方便调用
MyVue.prototype = {
  proxyKeys: function (key) {
    var self = this;
    Object.defineProperty(this, key, {
      enumerable: false,
      configurable: true,
      get: function getter() {
        return self.data[key];
      },
      set: function setter(newVal) {
        self.data[key] = newVal;
      },
    });
  },
};
