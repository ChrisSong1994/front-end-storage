function MyVue(options) {
  const self = this
  this.data = options.data
  this.el = options.el
  this.methods = options.methods;


  Object.keys(this.data).forEach(function (key) {
    self.proxyKeys(key);
  });

  observe(this.data);
  new Compile(this.el, this);
  options.mounted.call(this)  // 执行完成运行mounted
}

MyVue.prototype = {
  proxyKeys: function (key) {
    var self = this;
    Object.defineProperty(this, key, {
      enumerable: false,
      configurable: true,
      get: function getter() {
        return self.data[key]
      },
      set: function setter(newVal) {
        self.data[key] = newVal
      }
    })
  }
}