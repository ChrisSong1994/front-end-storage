// 参数格式化  get请求拼接
function formatParams(data) {
  var arr = [];
  for (var prop in data) {
    arr.push(prop + "=" + data[prop]);
  }
  return arr.join("&");
}

// ajax封装
// 参数格式
// var setting = {
//   method: "GET",
//   url:"地址"
//   async: "true",
//   data: {},
//   dataType: "json",
//   success: function() {},
//   error: function() {}
// };
function ajax(setting) {
  var options = {
    method: (setting.method || "GET").toUpperCase(), //请求方式
    url: setting.url || "", // 请求地址
    async: setting.async || true, // 是否异步
    dataType: setting.dataType || "json", // 解析方式
    data: setting.data || "", // 参数
    success: setting.success || function() {}, // 请求成功回调
    error: setting.error || function() {} // 请求失败回调
  };
  // 假如解析类型为jsonp 实现跨域
  if (options.dataType === "jsonp") {
    var jsonpScript = document.createElement("script");
    var callbackName = "jsonpCallBack"; // 回调函数名称
    document.body.appendChild(jsonpScript);
    jsonpScript.src =
      options.url + "?" + paramString + "&callback=" + callbackName;
    window.callbackName = function(data) {
      options.success(data);
      delete window.callbackName;
      document.body.removeChild(jsonpScript);
    };
  } else {
    var xhr = null;
    var paramString = formatParams(options.data);
    // 创建xhr 对象
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else {
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    // 发送请求
    if (options.method === "POST") {
      xhr.open("POST", options.url, options.async);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send(options.data);
    } else if (options.method === "GET") {
      xhr.open("GET", options.url + "?" + paramString);
      xhr.send();
    } else {
      console.error("仅支持get和post请求！");
    }
    // 请求相应
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
        switch (options.dataType) {
          case "json":
            var json = JSON.parse(xhr.responseText);
            options.success(json);
            break;
          case "xml":
            options.success(xhr.responseXml);
            break;
          default:
            options.success(xhr.responseText);
            break;
        }
      }
    };
    // 错误处理
    xhr.onerror = function(err) {
      options.error(err);
    };
  }
}

export default ajax;
