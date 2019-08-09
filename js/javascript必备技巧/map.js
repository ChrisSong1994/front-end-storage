/***
 * @param callback
 * @param thisArg
 *  */
const selfMap = function (callback, thisArg) {  // 不可以用箭头函数
  console.log(this)

  let arr = Array.prototype.slice.call(this)
  let mappedArr = []
  for (let i = 0; i < arr.length; i++) {
    // 判断稀疏数组的情况
    if (!arr.hasOwnProperty(i)) continue;
    mappedArr.push(callback.call(thisArg, arr[i], i, this))
  }
  return mappedArr
}

const selMapUseReduce = function (callback, thisArg) {
  let arr = Array.prototype.slice.call(this)

  return arr.reduce((pre, cur, index) => {
    return [...pre, callback.call(thisArg, cur, index, this)]
  }, [])
}


Array.prototype.selfMap || (Object.defineProperty(Array.prototype, 'selfMap', {
  value: selfMap,
  enumerable: false,
  configurable: true,
  writable: true
}))

const arr = [1, 6, 15, 62, 6, 69, 63, 2]

console.log(
  arr.selfMap((item, i) => {
    return item * 2
  })
)  