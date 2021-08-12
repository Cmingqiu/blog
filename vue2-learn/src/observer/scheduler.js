let queue = [];
let watcherIds = new Set();
let isPending = false; //异步锁 只开一次异步任务
export function queueWatcher(watcher) {
  if (!watcherIds.has(watcher.id)) {
    watcherIds.add(watcher.id);
    queue.push(watcher);
    if (!isPending) {
      //优先采用Promise,
      //不兼容再采用MutationObserve,
      //不兼容再采用setImmediate(IE中性能好),
      //不兼容最后采用setTimeOut
      Promise.resolve().then(flushSchedulerQueue);
      isPending = true;
    }
  }
}

function flushSchedulerQueue() {
  for (let i = 0, len = queue.length; i < len; i++) {
    const watcher = queue[i];
    watcher.run();
  }
  queue = [];
  watcherIds.clear();
  isPending = false;
}
