import {
  extend,
  hasChanged,
  isObject,
  isArray,
  isIntegerKey,
  hasOwn
} from '@vue/shared';
import { activeEffect, track, trigger } from './effect';
import { reactive, readonly } from './reactive';

const get = createGetter();
const shallowGet = createGetter(false, true);
const readonlyGet = createGetter(true, false);
const shallowReadonlyGet = createGetter(true, true);

const set = createSetter();
const shallowSet = createSetter(true);
const readonlySet = {
  set: (target, key) => {
    return console.warn(`can not set key "${key}"`);
  }
};

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_is_Reactive'
}

export const mutableHandlers = { get, set };

export const shallowReactiveHandlers = { get: shallowGet, set: shallowSet };

export const readonlyHandlers = extend({ get: readonlyGet }, readonlySet);

export const shallowReadonlyHandlers = extend(
  { get: shallowReadonlyGet },
  readonlySet
);

//创建get
function createGetter(isReadonly = false, isShallow = false) {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver);
    if (key === ReactiveFlags.IS_REACTIVE) return !isReadonly;
    if (!isReadonly) {
      /* console.log(`依赖收集，当前属性${key}`);
      console.log('activeEffect', activeEffect, activeEffect.id); */
      track(target, 'get', key);
    }
    if (isShallow) return res;
    //懒递归 当取值时才递归
    //readonly 会代理，但不能更改，不会收集依赖
    if (isObject(target[key]))
      return isReadonly ? readonly(res) : reactive(res);

    return res;
  };
}

//创建set
function createSetter(isShallow = false) {
  return function set(target, key, newValue, receiver) {
    const oldValue = target[key];
    //区分新增和修改动作
    //对象：有oldValue就是修改，没有就是新增
    //数组：key是数字即修改下标且下标小于数组长度是修改，否则是新增
    const hadKey =
      isArray(target) && isIntegerKey(key)
        ? Number(key) < target.length
        : hasOwn(target, key);

    const res = Reflect.set(target, key, newValue, receiver); //下面要拿到最新值

    //解决数组新增push项触发2次问题：push到数组还会触发length
    if (!hadKey) {
      //新增
      trigger(target, 'add', key, newValue, oldValue);
    } else if (hasChanged(newValue, oldValue)) {
      // 修改且不是新旧值不相等
      trigger(target, 'edit', key, newValue, oldValue);
    }

    return res;
  };
}
