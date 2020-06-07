
// 防抖函数： 任务频繁触发的情况下，只有任务触发的间隔超过指定间隔的时候，任务才会执行
// 作用： 输入，滚动，拖动等高频操作，节约性能

/**
 * @description 函数防抖
 * @param {Function} func -需要函数防抖的函数
 * @param {Number} time -延迟时间
 * @param {Options} options -配置项
 * @return {Function} -经过防抖处理的函数
 **/

/**
 * @typedef {Object} Options -配置项
 * @property {Boolean} leading -开始是否需要额外触发一次
 * @property {Boolean} trailing -结束后是否需要额外触发一次
 * @property {this} context -上下文
 **/

const debounce = (fun, time = 10, options = {
  // leading 和 trailing 无法同时为 false
  leading: true,
  trailing: true,
  context: null
}
) => {
  let timer;    //利用闭包的方式存放timer
  const _debounce = function (...args) {
    if (timer) {
      clearTimeout(timer);
    }

    if (options.leading && !timer) {
      timer = setTimeout(null, time)
      fun.apply(options.context, args);

    } else if (options.trailing) {
      timer = setTimeout(() => {
        fun.apply(options.context, args);
        timer = null;
      }, time);
    } else {


    }
  };

  //取消函数
  _debounce.cancel = function () {
    clearTimeout(timer);
    timer = null;
  };
  return _debounce;
};
