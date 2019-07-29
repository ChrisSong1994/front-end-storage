// 节流函数：在一定时间执行一次
// 作用


/**
 * @description 函数节流
 * @param {Function} func -需要函数节流的函数
 * @param {Number} time -延迟时间
 * @param {Options} options -配置项
 * @return {Function} -经过节流处理的函数
 **/

/**
 * @typedef {Object} Options -配置项
 * @property {Boolean} leading -开始是否需要额外触发一次
 * @property {Boolean} trailing -结束后是否需要额外触发一次
 * @property {this} context -上下文
 **/

const throttle = (fun, time = 200, options = {
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
        fun.apply(options.context, args)
      }, time)
    } else if (now - previous > time) {
      fun.apply(options.context, args)
      previous = now
    } else if (options.trailing) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        fun.apply(options.context, args)
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