## 基于 Promises/A+ 规范

[Promises/A+规范](https://promisesaplus.com/)

1. Promise 是一个类，通过 new 实例化，得到实例 promise
2. promise 有 3 种状态：pending，fulfilled，rejected。状态一旦发生改变就不会再更改
3. 接受一个参数 executor 函数，默认立即执行。函数有 2 个参数：resolve，reject。调用 resolve，reject 可以使 promise 状态变为成功或失败。
4. promise 实例有 then 和 catch 方法，成功状态走 then，失败状态走 catch
5. then 接收 2 个参数，成功和失败的回调
6. promise 中发生异常调用 reject，状态变为失败
7. promise 中如果有异步，结合发布订阅模式处理。将 then 中的回调存放数组中，在调用 resolve 或 reject 改变状态后执行。
8. then 可以进行链式调用：
   - 如果 then 的回调(成功/失败的回调)返回一个普通值(不是 promise 也不是 throw 错误出现异常)，就会作为参数传入下一个 then 的成功回调中；
   - 如果返回的是错误，会作为参数传入下一个失败的回调中；
   - 如果返回的是 promise，会等待 promise 执行完成，判断这个 promise 的状态，这个 promise 状态如果是成功就将成功结果传入下一个成功回调，如果是失败结果传入下一个失败的回调
9. promise 之所以能进行链式调用，并不是在 then 中返回 this，因为状态是无法改变的，不可能上一个是成功状态，下一个走失败状态，所以是因为在 then 中返回了一个新的 promise，才能链式调用，和 jquery 不一样
10. **Promise 中的值穿透:** then 的参数是可选的，如果不是函数就忽略，向下透传。.then 或者.catch 的参数期望是函数，传入非函数则会发生值穿透。当 then 中传入的不是函数，则这个 then 返回的 promise 的 data，将会保存上一个的 promise.data。这就是发生值穿透的原因。而且每一个无效的 then 所返回的 promise 的状态都为 resolved。  
    如果 then 的参数不是一个函数，就会把上一层传入的值直接传递给下一层 (类似直接 return this)，这就是值穿透现象。

```js
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log);
// 上面代码的输出是1
```

11. catch 本质就是第一个参数未 null 的 then

## 基本的 promise

按照规范构造 Promise 类，有实例方法 then，then 有成功回调和失败回调；promise 状态不会再次改变。可以进行同步操作但不能处理异步，并且不能链式调用

```js
const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

class Promise {
  constructor(executor) {
    this.status = PENDING; //状态
    this.value = undefined; //成功的值
    this.reason = undefined; //失败的值

    const resolve = value => {
      if (this.status === PENDING) {
        //保证状态不会再次改变，只能从pending变为其他状态
        this.status = FULFILLED;
        this.value = value;
      }
    };
    const reject = reason => {
      if (this.status === PENDING) {
        //保证状态不会再次改变，只能从pending变为其他状态
        this.status = REJECTED;
        this.reason = reason;
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.value);
    }
    if (this.status === REJECTED) {
      onRejected(this.reason);
    }
  }
}
```

## 异步处理的 promise

```js

class Promise {
  constructor(executor) {
    this.status = PENDING; //状态
    this.value = undefined; //成功的值
    this.reason = undefined; //失败的值
    this.onFulfilledCallbacks = []; // 成功的回调队列
    this.onRejectedCallbacks = []; //失败的回调队列

    const resolve = value => {
      if (this.status === PENDING) {
        //保证状态不会再次改变，只能从pending变为其他状态
        this.status = FULFILLED;
        this.value = value;
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };
    const reject = reason => {
      if (this.status === PENDING) {
        //保证状态不会再次改变，只能从pending变为其他状态
        this.status = REJECTED;
        this.reason = reason;
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.value);
    }
    if (this.status === REJECTED) {
      onRejected(this.reason);
    }
    if (this.status === PENDING) {
    this.onFulfilledCallbacks.push(() => {
      onFulfilled(this.value)
    }）
    this.onFulfilledCallbacks.push(() => {
      onRejected(this.reason)
    }）
    }
  }
}

```

## 完整的 promise

```js
const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

class Promise {
  constructor(executor) {
    this.status = PENDING; //状态
    this.value = undefined; //成功的值
    this.reason = undefined; //失败的值
    this.onFulfilledCallbacks = []; // 成功的回调队列
    this.onRejectedCallbacks = []; //失败的回调队列

    const resolve = value => {
      if (value instanceof promise) {
        //递归解析
        return value.then(resolve, reject);
      }

      if (this.status === PENDING) {
        //保证状态不会再次改变，只能从pending变为其他状态
        this.status = FULFILLED;
        this.value = value;
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };
    const reject = reason => {
      if (this.status === PENDING) {
        //保证状态不会再次改变，只能从pending变为其他状态
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  //then
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : err => {
            throw err;
          };

    //递归调用promise
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(x, promise2, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }

      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(x, promise2, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }

      if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(x, promise2, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(x, promise2, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    });

    return promise2;
  }
  //catch
  catch(onRejected) {
    return this.then(null, onRejected);
  }
  //finally 本质也是then，并且有等待效果；无论成功还是失败都会走finally
  finally(cb) {
    return this.then(
      y => {
        Promise.resolve(cb()).then(() => y);
      },
      err => {
        Promise.resolve(cb()).then(() => {
          throw err;
        });
      }
    );
  }

  //静态方法resolve 具有等待效果，如果value是promise，等待promise完成在走then
  static resolve(value) {
    return new Promise(resolve => {
      resolve(value);
    });
  }
  //静态方法reject 没有等待效果
  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  }
  //静态方法all
  static all(promises) {
    return new Promise((resolve, reject) => {
      let results = [],
        times = 0;
      const processResult = (i, val) => {
        results[i] = val;
        if (++times === promises.length) {
          resolve(results);
        }
      };

      for (let i = 0; i < promises.length; i++) {
        const p = promise[i];
        if (typeof p.then === 'function') {
          //让promise执行 promise.then()
          // Promise.resolve(p).then(y=> processResult(i,y))    ;
          p.then(y => processResult(i, y), reject);
        } else {
          processResult(i, p);
        }
      }
    });
  }
  //静态方法race
  static race(promises) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        const p = promises[i];
        Promise.resolve(p).then(resolve, reject);
      }
    });
  }
}

/* 校验返回值x的类型： 普通值还是promise */
function resolvePromise(x, promise2, resolve, reject) {
  if (x === promise2)
    return reject(new TypeError('不能自己等待自己完成，出错了'));

  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    //  捕获取值then时候的错误
    let called;
    try {
      let then = x.then;
      if (typeof then === 'function') {
        //断定x是promise ，这里不使用x.then方式调用避免再次取值报错问题
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            //万一then回调参数依然是promise，需要递归处理
            resolvePromise(y, promise2, resolve, reject);
          },
          r => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        //x是普通对象
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    //x是普通值
    resolve(x);
  }
}

module.exports = Promise;
```

## 测试 promise 是否符合规范

1.promise.js 中加上测试脚本，测试的时候默认调用该方法，会检测这个方法返回的对象是否符合规范，这个对象上需要有 promise 实例，resolve，reject

```js
Promise.deferred = () => {
  let deferred = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
};
```

2. 安装 promises-aplus-tests

```js
 cnpm i promises-aplus-tests -D
```

```json
{
  "name": "test-promise",
  "version": "1.0.0",
  "description": "",
  "main": "promise.js",
  "scripts": {
    "test": "promises-aplus-tests promise.js"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "promises-aplus-tests": "^2.1.2"
  }
}
```

3. 运行 npm run test,可以看到结果全部通过，符合 Promises/A+规范

![promise](@public/img/promise/1.png)
