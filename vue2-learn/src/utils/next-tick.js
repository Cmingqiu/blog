let callbacks = [];
let pending = false;
let timerFunc;

if (typeof Promise !== 'undefined') {
  timerFunc = () => {
    Promise.resolve().then(flushCallbacks);
  };
} else if (typeof MutationObserver !== 'undefined') {
  //MutationObserver
} else if (typeof setImmediate !== 'undefined') {
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}

export function nextTick(fn, opt) {
  if (!callbacks.includes(fn)) {
    callbacks.push(fn);

    if (!pending) {
      timerFunc();
      pending = true;
    }
  }
}

function flushCallbacks() {
  const copy = callbacks.slice(0);
  for (let i = 0; i < copy.length; i++) {
    copy[i]();
  }
  callbacks = [];
  pending = false;
}
