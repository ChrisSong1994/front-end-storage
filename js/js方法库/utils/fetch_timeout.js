/* 原生的fetch不带有timeout，自己封装一个带有timeout功能的fetch */
/**
 * 实现fetch的timeout 功能
 *  @param {object} fecthPromise  fecth
 * @param {Number} timeout  超时设置，默认5000ms
 * */

function fetch_timeout(fecthPromise, timeout = 5000) {
  let abort = null;

  let abortPromise = new Promise((resolve, reject) => {
    abort = () => {
      return reject({
        code: 504,
        message: "请求超时！"
      });
    };
  });

  // 最快出结果的promise 作为结果
  let resultPromise = Promise.race([fecthPromise, abortPromise]);

  setTimeout(() => {
    abort();
  }, timeout);

  return resultPromise;
}

export default fetch_timeout;
