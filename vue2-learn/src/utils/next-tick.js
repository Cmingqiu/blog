let callbacks = [];
let pending = false;
let timerFunc;

if (typeof Promise !== 'undefined') {
  let p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
  };
} else if (typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(1);
  observer.observe(textNode, { characterData: true });
  timerFunc = () => {
    textNode.textContent = 2;
  };
} else if (typeof setImmediate !== 'undefined') {
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}

// 内部会调用nextTick，用户也会调用，放进队列callbacks中，批量执行
export function nextTick(cb, ctx) {
  let _resolve;
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (error) {
        console.error('函数执行报错');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {  // 异步锁 是为了只开1个异步方法
    timerFunc();
    pending = true;
  }
  if (!cb && typeof Promise !== undefined) {
    return new Promise((resolve, reject) => {
      _resolve = resolve;
    });
  }
}

function flushCallbacks() {
  const copy = callbacks.slice(0);
  for (let i = 0; i < copy.length; i++) {
    copy[i]();
  }
  callbacks.length = 0;
  pending = false;
}
