function Watcher(vm, exp, cb) {
  this.vm = vm
  this.exp = exp
  this.cb = cb
  this.value = this.get()

}
Watcher.prototype = {
  update: function () {
    this.run()
  },

  run: function () {
    const value = this.vm.data[this.exp]
    debugger
    var oldVal = this.value;
    if (oldVal !== value) {
      this.value = value
      this.cb.call(this.vm, this.value, this.oldVal)
    }

  },
  get: function () {
    Dep.target = this
    const value = this.vm.data[this.exp]
    Dep.target = null
    return value
  }

}