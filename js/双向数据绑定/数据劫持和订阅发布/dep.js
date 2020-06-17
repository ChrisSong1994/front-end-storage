// 管理订阅者 和 消息分发  -- 中间人

function Dep() {
  this.subs = [];
}

Dep.prototype = {
  addSub: function(sub) {
    this.subs.push(sub);
  },
  notify: function() {
    this.subs.forEach(function(sub) {
      sub.update();
    });
  }
};

Dep.target = null;
