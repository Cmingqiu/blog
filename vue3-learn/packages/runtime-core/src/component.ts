import { isFunction, isObject } from '@vue/shared';

/**
 * 根据vnode创建实例
 */
let uid = 0;
export const createComponentInstance = (vnode) => {
  const instance = {
    uid: uid++,
    type: vnode.type, //用户传入的对象
    vnode, //实例的vnode
    props: {},
    attrs: {},
    slots: {},
    setupState: {}, //setup函数返回值对象
    proxy: null, //代理
    emit: null, //组件通信
    ctx: {}, //上下文
    isMounted: false, //组件是否已挂载
    subTree: null, //组件渲染的内容的虚拟dom
    render: null //组件的render函数
  };
  instance.ctx = { _: instance };

  return instance;
};

export const setupComponent = (instance) => {
  const { props, children } = instance.vnode;
  //初始化属性、插槽 ;属性响应式处理
  instance.props = props;
  instance.slots = children;
  // initProps(instance)
  // initSlots(instance)
  setupStatefulComponent(instance);
};

const setupStatefulComponent = (instance) => {
  const component = instance.type;
  const { setup } = component;
  if (setup) {
    let setupResult = setup(instance.props, createSetupContext(instance));

    handleSetupResult(instance, setupResult);
  }
};

function createSetupContext(instance) {
  return {
    attrs: instance.attrs,
    emit: instance.emit,
    slots: instance.slots,
    expose: () => {} //暴露组件对外的属性方法，父组件可以通过ref调用这些属性方法
  };
}

/**
 * 调用setup后拿到返回结果
 * @param instance
 * @param setupResult
 */
function handleSetupResult(instance, setupResult) {
  if (isFunction(setupResult)) {
    //setup返回的是render函数
    instance.render = setupResult;
  } else if (isObject(setupResult)) {
    //setup返回的是对象
    instance.setupState = setupResult;
  }
  if (!instance.render) {
    const component = instance.type;
    if (component.render) {
      instance.render = component.render;
    } else if (component.template) {
      //模板编译 compileToFunction
    }
  }
  console.log(instance, setupResult);
}
