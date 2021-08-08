let queue = [];
let isFlushing = false;

/**
 * 批量处理，先去重缓存，之后异步更新
 * @param effect
 */
export const queueJob = effect => {
  if (!queue.includes(effect)) {
    queue.push(effect);
    queueFlash();
  }
};

const queueFlash = () => {
  if (!isFlushing) {
    isFlushing = true;
    Promise.resolve().then(flashJobs);
  }
};

/**
 * 清空队列，更新是先父后子，父组件的id比子组件小，所有先升序排序
 */
const flashJobs = () => {
  isFlushing = false; //批处理结束，开始更新视图
  queue.sort((a, b) => a.id - b.id);
  queue.forEach(job => job());
  queue.length = 0;
};

export const nextTick = fn => {
  return Promise.resolve().then(fn);
};
