function Compile(el, vm) {
  this.el = document.querySelector(el)
  this.vm = vm;
  this.fragment = null
  this.init()
}

Compile.prototype = {
  init: function () {
    if (this.el) {
      this.fragment = this.nodeToFragment(this.el)
      this.compileElement(this.fragment)
      this.el.appendChild(this.fragment)
    } else {
      console.log('dom不存在！')
    }
  },
  nodeToFragment: function (el) {
    let fragment = document.createDocumentFragment()
    let child = el.firstChild
    while (child) {
      fragment.appendChild(child)
      child = el.firstChild
    }
    return fragment
  },
  compileElement: function (el) {  // 编译dom片段
    let childNodes = el.childNodes;
    [].slice.call(childNodes).forEach((node) => {

      var reg = /\{\{\s*(.*?)\s*\}\}/  // 花括号包含内容
      const text = node.textContent

      if (this.isElementNode(node)) {
        this.compile(node);
      } else if (reg.test(text) && this.isTextNode(node)) {
        this.compileText(node, reg.exec(text)[1])
      }

      // 递归遍历编译子节点
      if (node.childNodes && node.childNodes.length) {
        this.compileElement(node)
      }

    })
  },
  compile: function (node) {
    const nodeAttrs = node.attributes;
    Array.prototype.forEach.call(nodeAttrs, (attr) => {
      const attrName = attr.name;
      var exp = attr.value;
      if (this.isDirective(attrName)) {
        var dir = attrName.substring(2)
        if (this.isEventDirective(dir)) {
          this.compileEvent(node, this.vm, exp, dir)
        } else {
          this.compileModel(node, this.vm, exp, dir)
        }
      }
    })

  },
  compileEvent: function (node, vm, exp, dir) {
    const eventType = dir.split(':')[1]
    const cb = vm.methods && vm.methods[exp];
    if (eventType && cb) {
      node.addEventListener(eventType, cb.bind(vm), false)
    }
  },
  compileModel: function (node, vm, exp, dir) {  // 解析v-model指令
    var val = vm[exp]
    debugger
    this.updateText(node, val)
    debugger
    new Watcher(vm, exp, (value) => {
      this.modelUpdater(node, value)
    })

    node.addEventListener('input', (e) => {
      debugger
      let newVal = e.target.value
      if (val === newVal) return
      vm[exp] = newVal
      val = newVal
    })
  },
  compileText: function (node, exp) {
    const initText = this.vm[exp]
    debugger
    this.updateText(node, initText)
    new Watcher(this.vm, exp, (value) => {
      this.updateText(node, value)
    })
  },
  updateText: function (node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value
  },
  modelUpdater: function (node, value, oldValue) {
    node.value = typeof value == 'undefined' ? '' : value;
  },
  isTextNode: function (node) {
    return node.nodeType === 3
  },
  isElementNode: function (node) {
    return node.nodeType === 1
  },
  isDirective: function (attr) {
    return attr.indexOf('v-') == 0;
  },
  isEventDirective: function (attr) {
    return attr.indexOf('on:') == 0;
  }


}