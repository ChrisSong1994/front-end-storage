function MyVue(options) {
  const self = this
  this.data = options.data
  Object.keys(this.data).forEach(function (key) {
    self.proxyKeys(key);
  });

  observe(data);

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