import { currentInstance, setCurrentInstance } from './component';

const enum LifeCycle {
  BEFORE_MOUNT = 'bm',
  MOUNTED = 'm',
  BEFORE_UPDATE = 'bu',
  UPDATED = 'u'
}

const injectHooks = (type, hook, target) => {
  if (!target) {
    return console.error('xx');
  }
  let hooks = target[type] || (target[type] = []);
  const wrap = () => {
    setCurrentInstance(target);
    hook(); //执行钩子之前设置正确的实例，借助js的单线程原理
    setCurrentInstance(null); //执行完成之后重置实例
  };
  hooks.push(wrap);
};

const createHook = type => {
  return (hook, target = currentInstance) => {
    injectHooks(type, hook, target);
  };
};

export const invokeArrayFns = fns => fns.forEach(fn => fn());

export const onBeforeMount = createHook(LifeCycle.BEFORE_MOUNT);
export const onMounted = createHook(LifeCycle.MOUNTED);
export const onBeforeUpdate = createHook(LifeCycle.BEFORE_UPDATE);
export const onUpdated = createHook(LifeCycle.UPDATED);
