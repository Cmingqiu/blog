import { isObject } from '@vue/shared';
import {
  mutableHandlers,
  ReactiveFlags,
  readonlyHandlers,
  shallowReactiveHandlers,
  shallowReadonlyHandlers
} from './baseHandlers';

export function reactive(target) {
  return createReactiveObject(target, false, mutableHandlers);
}

export function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveHandlers);
}

export function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers);
}

export function shallowReadonly(target) {
  return createReactiveObject(target, true, shallowReadonlyHandlers);
}

//添加缓存
const reactiveMap = new WeakMap();
const readonlyMap = new WeakMap();
/**
 * @param target 代理对象
 * @param isReadonly 是否是只读的 默认不是仅读
 * @param baseHandlers 处理方式
 * @returns
 */
function createReactiveObject(target, isReadonly = false, baseHandlers) {
  if (!isObject(target)) return target;
  if (target[ReactiveFlags.IS_REACTIVE]) return target;
  const proxyMap = isReadonly ? readonlyMap : reactiveMap;
  const existMap = proxyMap.get(target);
  if (existMap) return existMap;

  const proxy = new Proxy(target, baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
