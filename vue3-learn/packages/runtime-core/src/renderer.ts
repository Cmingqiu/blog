import { ShapeFlags } from '@vue/shared';
import { createAppAPI } from './apiCreateApp';
import { createComponentInstance, setupComponent } from './component';

export function createRenderer(rendererOptions) {
  /**
   * 创建组件:需要创建组件的实例，调用组件实例上的setup，拿到render函数，
   *         再调用render，拿到render的返回结果,即组件要渲染的内容的虚拟dom(subTree)
   * @param n2
   * @param container
   */
  const mountComponent = (n2, container) => {
    let instance = (n2.component = createComponentInstance(n2));
    //给实例添加属性 ， 调用setup
    setupComponent(instance);
  };

  /**
   * 更新组件
   * @param n1
   * @param n2
   * @param container
   */
  const updateComponent = (n1, n2, container) => {};

  /**
   * 处理组件：第一次挂载 或 更新渲染
   * @param n1
   * @param n2
   * @param container
   */
  const processComponent = (n1, n2, container) => {
    if (n1 === null) {
      mountComponent(n2, container);
    } else {
      // updateComponent(n1,n2,container)
    }
  };

  const patch = (n1, n2, container) => {
    //n2可能是元素，也可能是组件，需要判断类型
    const { shapeFlag } = n2;
    if (shapeFlag & ShapeFlags.ELEMENT) {
      //是元素
      // patchElement(n1, n2, container)
    } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      //是组件的虚拟节点
      processComponent(n1, n2, container);
    }
  };
  const render = (vnode, container) => {
    //更新逻辑
    patch(null, vnode, container);
  };

  return {
    createApp: createAppAPI(render),
    render
  };
}
