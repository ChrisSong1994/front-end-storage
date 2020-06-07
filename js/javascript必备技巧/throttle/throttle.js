// 节流函数：在一定时间执行一次

/**
 * @description 函数节流
 * @param {Function} func -需要函数节流的函数
 * @param {Number} time -延迟时间
 * @param {Options} options -配置项
 * @return {Function} -经过节流处理的函数
 **/

/**
 * @typedof {Object} Options -配置项
 * @property {Boolean} leading -开始是否需要额外触发一次
 * @property {Boolean} trailing -结束后是否需要额外触发一次
 * @property {this} context -上下文
 **/

const throttle = (func, time = 200, options = {
  // leading 和 trailing 无法同时为 false
  leading: true,
  trailing: true,
  context: null
}) => {
  let previous = new Date().getTime()
  let timer
  const _throttle = (...args) => {
    let now = new Date().getTime();
    if (!options.leading) {
      if (timer) return
      timer = setTimeout(() => {
        timer = null
        func.apply(options.context, args)
      }, time)
    } else if (now - previous > time) { // 第一次执行
      func.apply(options.context, args)
      previous = now
    } else if (options.trailing) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        func.apply(options.context, args)
      }, time)
    }

  }

  _throttle.cancel = () => {
    previous = 0
    clearTimeout(timer)
    timer = null
  }

  return _throttle
}

//使用Proxy实现函数节流 :apply方法拦截函数的调用、call和apply操作。
const throttleProxy = (func, time = 200, options = {
  // leading 和 trailing 无法同时为 false
  leading: true,
  trailing: true,
  context: null
}) => {
  let timer;
  let previous = new Date(0).getTime();
  let handler = {
    apply(target, _, args) {
      // 和闭包实现核心逻辑相同
      let now = new Date().getTime();
      if (!options.leading) {
        if (timer) return;
        timer = setTimeout(() => {
          timer = null;
          Reflect.apply(func, options.context, args)
        }, time)

      } else if (now - previous > time) {
        Reflect.apply(func, options.context, args)
        previous = now
      } else if (options.trailing) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          Reflect.apply(func, options.context, args)
        }, time)
      }
    }
  }
  return new Proxy(func, handler)
}
