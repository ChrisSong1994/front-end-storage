// 截流函数：调用后在限时内执行一次，限时内再次调用，函数执行判断条件为关闭状态，函数不执行，函数执行后判断条件打开
function throttle(func, limit) {
  let inThrottle; // 开关
  return function () {
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
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce); // 定时器用来执行函数
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
}


// 参数格式化 ：get请求拼接
function formatUrlParams(data) {
  var arr = [];
  for (var prop in data) {
    arr.push(prop + "=" + data[prop]);
  }
  return arr.join("&");
}


// 除去空格
function trimSpace(str) {
  var reg = /^\s*(.*?)\s+$/;
  return str.replace(reg, "");
}

function ltrim(s) { return s.replace(/^(\s*|　*)/, ""); }
function rtrim(s) { return s.replace(/(\s*|　*)$/, ""); }


// 获取滚动条到底部的距离
function getScrollBottom(elm) {
  return elm.scrollHeight - elm.scrollTop - elm.clientHeight;
}

// 获取m-n内的随机数
function getRandomFromMtoN(m, n) {
  return Math.random() * (n - m) + m
}

// 复制到剪贴板
function copyToClipboard(value) {
  const _tempInput = document.createElement('input')
  _tempInput.value = value
  document.body.appendChild(_tempInput)
  _tempInput.select()
  document.execCommand('copy')
  document.body.removeChild(_tempInput)
}

//前端生成文件下载
function createAndDownloadFile(fileName, suffix, content) {
  const aTag = document.createElement('a');
  const blob = new Blob([content]);
  aTag.download = `${fileName}.${suffix}`;
  aTag.href = URL.createObjectURL(blob);
  aTag.click();
  URL.revokeObjectURL(blob);
}

// 文本高亮
function highlight(text, words, tag = 'span') {
  let i, len = words.length, re;
  for (i = 0; i < len; i++) {
    re = new RegExp(words[i], 'g');
    if (re.test(text)) {
      text = text.replace(re, '<' + tag + ' class="highlight">$&</' + tag + '>');
    }
  }
  return text;
}

// 限制文本字数
function excerpt(str, nwords) {
  let words = str.split('');
  words.splice(nwords, words.length - 1);
  return words.join('') +
    (words.length !== str.split('').length ? '…' : '');
}

// 地址url校验
function urlVertify(url) {
  let urlReg = new RegExp('(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]')
  return urlReg.test(url)
}


// 获取当前位置信息
function getLocation(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (p) {
      callback(p.coords.latitude, p.coords.longitude)
    }, function (e) {
      var msg = e.code + "\n" + e.message
      console.error(msg)
    })
  }
}

// 时间日期格式转换
Date.prototype.Format = function (formatStr) {
  var str = formatStr;
  var Week = ['日', '一', '二', '三', '四', '五', '六'];
  str = str.replace(/yyyy|YYYY/, this.getFullYear());
  str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));
  str = str.replace(/MM/, (this.getMonth() + 1) > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
  str = str.replace(/M/g, (this.getMonth() + 1));
  str = str.replace(/w|W/g, Week[this.getDay()]);
  str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
  str = str.replace(/d|D/g, this.getDate());
  str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
  str = str.replace(/h|H/g, this.getHours());
  str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
  str = str.replace(/m/g, this.getMinutes());
  str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
  str = str.replace(/s|S/g, this.getSeconds());
  return str
}

// 判断是否为数字类型(字符串数字或者数字类型数字)
function isDigit(value) {
  var patrn = /^[0-9]*$/;
  if (patrn.exec(value) == null || value == "") {
    return false
  } else {
    return true
  }
}

// 获取数据类型
function getType(a) {
  var typeArray = Object.prototype.toString.call(a).split(" ");
  return typeArray[1].slice(0, -1);
}

// 设置cookie
function setCookie(name, value, Hours) {
  var d = new Date();
  var offset = 8;
  var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  var nd = utc + (3600000 * offset);
  var exp = new Date(nd);
  exp.setTime(exp.getTime() + Hours * 60 * 60 * 1000);
  document.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString() + ";domain=" + 域名
}

// 获取cookie
function getCookie(name) {
  var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
  if (arr != null) return unescape(arr[2]);
  return null
}

/**
 * 指定的现有节点之后插入新的节点
 * @param {Node} newNode 需要插入的节点对象
 * @param {Node} existingNode 现有的节点
 */
function insertAfter(newNode, existingNode) {
  const parent = existingNode.parentNode;
  if (parent.lastChild === existingNode) {
    parent.appendChild(newNode);
  } else {
    // .nextSibling 该属性返回指定节点后的第一个节点
    parent.insertBefore(newNode, existingNode.nextSibling);
  }
}
