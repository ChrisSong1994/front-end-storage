// 要求规范 (https://promisesaplus.com/)

// 包含静态方法：all,resolve,reject,race
// 包含原型方法：then,catch,finally

// 定义状态常量
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

//executor
function MyPromise(executor) {
  const self = this // 需要在resolve 和reject 的函数中绑定当前的promise 对象this
  this.status = PENDING
  this.value = undefined
  this.reason = undefined
  this.onFullfilledArray = [] // 用来搜集存放待执行的成功的函数
  this.onRejectedArray = [] // 用来搜集存放待执行的失败的函数

  function resolve(value) {
    if (self.status === PENDING) {
      self.status = FULFILLED
      self.value = value
      // 触发then函数注册的onFullFilled 函数
      self.onFullfilledArray.forEach(function(func) {
        func(self.value)
      })
    }
  }

  function reject(reason) {
    if (self.status === REJECTED) {
      self.status = REJECTED
      self.reason = reason
      // 触发then函数注册的onFullFilled 函数
      self.onRejectedArray.forEach(function(func) {
        func(self.reason)
      })
    }
  }

  try {
    executor(resolve, reject) // 执行函数暴露出两个函数作为参数
  } catch (err) {
    reject(err)
  }
}

// 私有方法
// 对于resolve 可能接收的参数做一个分类处理
// 1.假如promise 和 x 是同一个引用则抛出一个TypeError
// 2.x是promise 则直接返回promise
// 3.x是一个thenable 对象或者函数则把resolve 和reject 注册到thenable 中
// 4.如果像是一个普通对象或者其他则作为resolve 的参数 value 执行
function resolvePromise(promise, x, resolve, reject) {
  // debugger
  if (promise === x) {
    // ？？？ 什么时候出现这种情况
    reject(new TypeError('cyclic reference'))
  }
  let isUsed // 如果同时调用resolve和reject，或者对同一参数进行了多次调用，则第一个调用优先，而所有其他调用均被忽略。
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      const then = x.then
      if (typeof then === 'function') {
        // 判断出x是一个 thenable,如果是则调用x的then函数
        then.call(
          x,
          function(y) {
            // y是 thenable执行完成的返回值
            // debugger
            if (isUsed) return
            isUsed = true
            resolvePromise(promise, y, resolve, reject)
          },
          function(err) {
            if (isUsed) return
            isUsed = true
            reject(err)
          }
        )
      } else {
        resolve(x)
      }
    } catch (err) {
      if (isUsed) return
      isUsed = true
      reject(err)
    }
  } else {
    resolve(x)
  }
}

// 原型方法
// then方法和执行器 executor一样是立即执行函数
// then 主要用来把代执行的函数push到任务栈
MyPromise.prototype.then = function(onFullfilled, onRejected) {
  // 参数判断，如果onFullfilled和onRejected 不是函数则被忽略
  onFullfilled =
    typeof onFullfilled === 'function'
      ? onFullfilled
      : function(v) {
          return v
        }
  onRejected =
    typeof onRejected === 'function'
      ? onRejected
      : function(e) {
          return e
        }

  // 绑定实例对象到self
  const self = this
  let promise2 // then调用后会返回一个promise实例用于链式调用
  // debugger
  switch (self.status) {
    case PENDING:
      promise2 = new MyPromise(function(resolve, reject) {
        // 在执行上下文堆栈仅包含平台代码之前，不得调用onFulfilled或onRejected
        self.onFullfilledArray.push(function() {
          setTimeout(function() {
            // 所有的then 方法注册的方法都要在程序代码后面执行
            try {
              const x = onFullfilled(self.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          })
        })

        self.onRejectedArray.push(function() {
          setTimeout(function() {
            try {
              const x = onRejected(self.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          })
        })
      })

      break
    // 当状态变成fulfiled 或者 REJECTED直接执行then的回调函数
    case FULFILLED:
      promise2 = new MyPromise(function(resolve, reject) {
        setTimeout(function() {
          try {
            const x = onFullfilled(self.value)
            // debugger
            resolvePromise(promise2, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })
      })
      break

    case REJECTED:
      promise2 = new MyPromise(function(resolve, reject) {
        setTimeout(function() {
          try {
            const x = onRejected(self.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })
      })
      break
    default:
      break
  }
  return promise2
}

/**
 * catch 直接返回只有onRejected回调函数的then方法
 * */

MyPromise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected)
}

/**
 * 不管成功还是失败，都会走到finally中,并且finally之后，还可以继续then。并且会将值原封不动的传递给后面的then.
 * 接收一个回调函数,执行回调函数完后，并 不会 把回调函数的返回值传给下一个onFulFilled， 不会 影响原来的值
 */
MyPromise.prototype.finally = function(callback) {
  return this.then(
    value => {
      return MyPromise.resolve(callback()).then(() => {
        return value // 这里只是执行callback并不回影响onFulFilled的返回值
      })
    },
    err => {
      return MyPromise.resolve(callback()).then(() => {
        throw err
      })
    }
  )
}

// 静态方法
/**
 * resolve:resolve(value) 返回一个以给定值解析后的Promise 对象.
 * 1.value 是一个promise 直接返回
 * 2.value 是一个thenable 返回一个peomise 跟随thenable 的状态
 * 3.value 是一个普通值，返回 成功状态调用
 */
MyPromise.resolve = function(value) {
  if (value instanceof MyPromise) {
    return value
  }
  return new MyPromise(function(resolve, reject) {
    if (value && value.then && typeof value === 'function') {
      setTimeout(()=>{
        value.then(resolve, reject)
      })
    } else {
      resolve(value)
    }
  })
}

// reject 直接返回rejected 状态
MyPromise.reject = function(value) {
  return new MyPromise(function(resolve, reject) {
    reject(value)
  })
}

/**
 * 传入一个promise 的数组，返回一个返回值的数组
 */
MyPromise.all = function(promises) {
  return new MyPromise((resolve, reject) => {
    let index = 0
    let result = []
    debugger
    if (promises.length === 0) {
      resolve(result)
    } else {
      debugger
      for (let i = 0; i < promises.length; i++) {
        MyPromise.resolve(promises[i]).then(
          data => {
            debugger
            result[i] = data
            if (++index === promises.length) {
              // 用一个闭包值index来确定 promises执行后完毕的时机
              resolve(result)
            }
          },
          err => {
            reject(err) // 当有一个promise报错的时候即返回
            return
          }
        )
      }
    }
  })
}
/**
 * race函数返回一个 Promise，它将与第一个传递的 promise 相同的完成方式被完成。
 * 它可以是完成（ resolves），也可以是失败（rejects），这要取决于第一个完成的方式是两个中的哪个。
 */
MyPromise.race = function(promises) {
  return new MyPromise((resolve, reject) => {
    if (promises.length === 0) {
      // 无promises队列则直接返回
      return
    } else {
      for (let i = 0; i < promises.length; i++) {
        MyPromise.resolve(promises[i]).then(
          data => {
            resolve(data)
            return
          },
          err => {
            reject(err)
            return
          }
        )
      }
    }
  })
}

// 测试
const p1 = new MyPromise(function(resolve, reject) {
  // debugger
  setTimeout(() => {
    resolve(1)
  }, 3000)
})

const p2 = new MyPromise(function(resolve, reject) {
  // debugger
  setTimeout(() => {
    resolve(2)
  }, 4000)
})

// const p = new Promise(function(resolve, reject) {
//   // debugger
//   setTimeout(() => {
//     resolve(1)
//   }, 3000)
// })

// p.then(function(x) {
//   debugger
//   console.log('then1', x)
//   return p
// })
//   .then(function(x) {
//     debugger
//     console.log('then2', x)
//     return x
//   })
//   .finally(() => {
//     return 3
//   })
//   .then(x => {
//     console.log(x)
//   })


// MyPromise.all([p1,p2]).then((res)=>{
//   debugger
//   console.log(res)
// }).catch(err=>{
//   console.log(err)
// })

MyPromise.race([p1,p2]).then((res)=>{
  debugger
  console.log(res)
}).catch(err=>{
  console.log(err)
})

// MyPromise.resolve(p1).then(res=>{
//   debugger
//   console.log(res)
// })