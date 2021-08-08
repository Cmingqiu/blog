import { effect } from '@vue/reactivity';
import { hasChanged } from '@vue/shared';

/**
 * 默认不执行回调
 * 批量更新可以缓存到数组中，开一个异步任务，做队列刷新
 * @param source
 * @param cb
 * @param param2
 */
const doWatch = (source, cb, { immediate = false, flush = false }) => {
  let oldValue;
  const scheduler = () => {
    if (cb) {
      //数据发生改变会走到scheduler这里，再执行一次拿到newValue
      let newValue = runner();
      if (hasChanged(newValue, oldValue)) {
        cb(newValue, oldValue);
        oldValue = newValue; //为了下次传入参数，更新oldValue
      }
    } else {
      source();
    }
  };

  const runner = effect(() => source(), {
    lazy: true,
    scheduler
  });

  if (immediate) {
    scheduler(); //此时oldValue为undefined
  }

  //先立即执行一次拿到oldValue
  oldValue = runner();
};

export const watch = (source, cb, options = {}) => {
  return doWatch(source, cb, options);
};

/**
 * 默认先执行一次，依赖发生变化就执行回调
 * @param source
 * @returns
 */
export const watchEffect = source => {
  return doWatch(source, null, {});
};
