function Watcher(vm, exp, cb) {
  this.vm = vm;
  this.exp = exp;
  this.cb = cb;
  this.value = this.get();
}

Watcher.prototype = {
  update: function () {
    this.run();
  },

  run: function () {
    const value = this.vm.data[this.exp];
    debugger;
    var oldVal = this.value;
    if (oldVal !== value) {
      this.value = value;
      this.cb.call(this.vm, this.value, this.oldVal);
    }
  },

  get: function () {
    /*
     * 每一次实例化观察者的时候都会为Dep.target 赋值，
     * 目的是在 this.vm.data[this.exp] 这一步出发数据的get 函数，
     * 从而完成当前观察者被搜集的工作
     */

    Dep.target = this;
    const value = this.vm.data[this.exp];
    Dep.target = null;
    return value;
  },
};
