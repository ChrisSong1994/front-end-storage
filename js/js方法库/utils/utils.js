// 截流函数：调用后在限时内执行一次，限时内再次调用，函数执行判断条件为关闭状态，函数不执行，函数执行后判断条件打开
function throttle(func, limit) {
  let inThrottle; // 开关
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        // 定时器用来进行保证在一定时间内开关的状态
        inThrottle = false;
      }, limit);
    }
  };
}

// 防抖函数：调用后在一定的时间内函数不执行，过了限时执行，在限时内再次调用会重新开启定时器
function debounce(func, delay) {
  let inDebounce;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce); // 定时器用来执行函数
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
}


// 参数格式化 ：get请求拼接
function formatParams(data) {
  var arr = [];
  for (var prop in data) {
    arr.push(prop + "=" + data[prop]);
  }
  return arr.join("&");
}

 // 除去前后空格
 function trimSpace(str) {
  var reg = /^\s+|\s+$/g;
  return str.replace(reg, "");
}