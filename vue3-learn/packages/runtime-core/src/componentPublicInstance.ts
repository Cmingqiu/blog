import { hasOwn } from '@vue/shared';

export const componentPublicInstance = {
  get({ _: instance }, key, receiver) {
    //取值有优先顺序，先取setupState，再取props
    const { props, setupState } = instance;
    if (hasOwn(setupState, key)) {
      return Reflect.get(setupState, key);
    } else if (hasOwn(props, key)) {
      return Reflect.get(props, key);
    }
  },
  set({ _: instance }, key, value, receiver) {
    const { props, setupState } = instance;
    if (hasOwn(setupState, key)) {
      return Reflect.set(setupState, key, value);
    } else if (hasOwn(props, key)) {
      return Reflect.set(props, key, value);
    }
  }
};
