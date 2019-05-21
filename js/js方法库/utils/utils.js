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