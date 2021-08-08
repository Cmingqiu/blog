import { effect } from '@vue/reactivity';
import { hasOwn, isSameVnode, ShapeFlags } from '@vue/shared';
import { createAppAPI } from './apiCreateApp';
import { invokeArrayFns } from './apiLifeCycle';
import { createComponentInstance, setupComponent } from './component';
import { componentPublicInstance } from './componentPublicInstance';
import { queueJob } from './scheduler';

export function createRenderer(rendererOptions) {
  const {
    createElement: hostCreateElement,
    insert: hostInsert,
    setElementText: hostSetElementText,
    remove: hostRemove,
    patchProp: hostPatchProp
  } = rendererOptions;
  const setupRenderEffect = (instance, container) => {
    //状态更新重新执行渲染视图  组件级更新
    instance.update = effect(
      function componentEffect() {
        if (!instance.isMounted) {
          const { bm, m } = instance; //执行生命周期函数
          if (bm) {
            invokeArrayFns(bm);
          }
          //第一次渲染
          if (!instance.render) {
            return console.error('must provide a render function or template');
          }
          let subTree = (instance.subTree = instance.render.call(
            instance.proxy,
            instance.proxy
          )); //调用render函数会取值
          patch(null, subTree, container);
          instance.isMounted = true;

          if (m) {
            invokeArrayFns(m);
          }
        } else {
          const { bu, u } = instance; //执行生命周期函数
          if (bu) {
            invokeArrayFns(bu);
          }

          //dom-diff视图更新  获取到新老vnode，然后进行diff比对
          const prevTree = instance.subTree; //数据没变的vnode
          const nextTree = instance.render.call(instance.proxy, instance.proxy); //变化后的vnode
          instance.subTree = nextTree;
          patch(prevTree, nextTree, container);

          if (u) {
            invokeArrayFns(u);
          }
        }
      },
      { scheduler: queueJob }
    );
  };
  /**
   * 创建组件:需要创建组件的实例，调用组件实例上的setup，拿到render函数，
   *         再调用render，拿到render的返回结果,即组件要渲染的内容的虚拟dom(subTree)
   * @param n2
   * @param container
   */
  const mountComponent = (n2, container) => {
    let instance = (n2.component = createComponentInstance(n2));
    //给实例添加属性,proxy ， 调用setup
    instance.proxy = new Proxy(instance.ctx, componentPublicInstance);
    setupComponent(instance);
    //调用render函数，每个组件都有一个渲染effect
    setupRenderEffect(instance, container);
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

  const patchProps = (el, prevProps, newProps) => {
    //新节点中有的属性使用新节点的，老节点有的新节点没有则移除
    for (let key in newProps) {
      if (prevProps[key] !== newProps[key]) {
        hostPatchProp(el, key, prevProps[key], newProps[key]);
      }
    }
    for (let key in prevProps) {
      if (!hasOwn(newProps, key)) {
        hostPatchProp(el, key, prevProps[key], null);
      }
    }
  };

  /**
   * 比较子节点数组
   * @param c1 数组
   * @param c2 数组
   * @param container 父节点el
   * dom diff的几种情况:
    1.
      oldVnode: A B C 
      newVnode: A B C 
      循环结束后：i=3 e1=2 e2=2
    2.新的比老的多
      (1) oldVnode: A B C  
          newVnode: A B C D 
          循环结束后：i=3 e1=2 e2=3

      (2) oldVnode:   A B C  
          newVnode: D A B C 
          循环结束后：i=0 e1=-1 e2=0
    3.
      oldVnode: A B C 
      newVnode: A B D C  
      循环结束后：i=2 e1=1 e2=2
    4.新的比老的少
      (1) oldVnode: A B C D 
          newVnode: A B C 
          循环结束后：i=3 e1=3 e2=2
      (2) oldVnode: D A B C
          newVnode: A B C 
          循环结束后：i=0 e1=0 e2=-1
   */
  const patchKeyChildren = (c1, c2, container, anchor) => {
    let i = 0,
      e1 = c1.length - 1,
      e2 = c2.length - 1;
    // sync from start 从头开始遍历
    while (i <= e1 && i <= e2) {
      //循环到最短长度的children结束，比对到节点不同则中断循环
      const n1 = c1[i];
      const n2 = c2[i];
      if (isSameVnode(n1, n2)) {
        patch(n1, n2, container);
      } else {
        break;
      }
      i++;
    }
    // sync from end 从尾开始遍历
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];
      if (isSameVnode(n1, n2)) {
        patch(n1, n2, container);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    // console.log(i, e1, e2);
    if (i > e1) {
      //新的比老的多
      if (i <= e2) {
        //e2+1如果超过数组长度就是后面多出2(1)往后追加，否则是往前追加2(2)
        const nextPose = e2 + 1;
        const anchor = nextPose < c2.length ? c2[nextPose].el : null;
        while (i <= e2) {
          //将多出的节点插入老节点前面或者后面
          patch(null, c2[i++], container, anchor);
        }
      }
    } else if (i > e2) {
      //老的比新的多
      //移除i和e1之间的节点
      while (i <= e1) {
        unmount(c1[i++]);
      }
    } else {
      //中间的乱序比对：最长递增子序列
    }
  };
  /**
   * 比较children
   * 1.老vnode有children，新vnode没有children，直接清空
   * 2.老vnode没有children，新vnode有children，直接插入children
   * 3.新老都有文本children，直接用新的文本children替换
   * 4.新老都有非文本children(数组children)
   * @param n1
   * @param n2
   * @param container
   */
  const patchChildren = (n1, n2, container, anchor) => {
    const { children: c1, shapeFlag: prevShapeFlag } = n1;
    const { children: c2, shapeFlag: newShapeFlag } = n2;

    if (newShapeFlag & ShapeFlags.TEXT_CHILDREN) {
      //新children是文本
      hostSetElementText(container, c2);
    } else {
      //新children是数组
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        //老children是数组
        patchKeyChildren(c1, c2, container, anchor);
      } else {
        //老children是文本
        //先清空容器，载挂载子节点数组
        hostSetElementText(container, '');
        mountChildren(c2, container);
      }
    }
  };
  const patchElement = (n1, n2, container, anchor) => {
    let el = (n2.el = n1.el); //尽可能复用老节点
    const prevProps = n1.props || {};
    const newProps = n2.props || {};
    //diff 属性
    patchProps(el, prevProps, newProps);
    //diff 子节点
    patchChildren(n1, n2, el, anchor);
  };
  /**
   * 处理元素标签
   * @param n1
   * @param n2
   * @param container
   */
  const processElement = (n1, n2, container, anchor) => {
    if (n1 === null) {
      mountElement(n2, container);
    } else {
      //DOM diff
      patchElement(n1, n2, container, anchor);
    }
  };

  const mountChildren = (children, container) => {
    children.forEach(child => {
      patch(null, child, container);
    });
  };
  /**
   * 将虚拟dom转成真实节点，插入到容器中
   * @param vnode
   * @param container
   */
  const mountElement = (vnode, container) => {
    const { type, props, children, shapeFlag } = vnode;
    let el = (vnode.el = hostCreateElement(type));
    if (props) {
      for (let key in props) {
        hostPatchProp(el, key, null, props[key]);
      }
    }
    // 创建children
    if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      //children是数组
      mountChildren(children, el);
    } else if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // children是文本
      hostSetElementText(el, children);
    }
    hostInsert(el, container);
  };

  const unmount = vnode => hostRemove(vnode.el);
  /**
   * 初始化和diff操作
   * @param n1
   * @param n2
   * @param container
   * @param anchor 插入元素的位置 默认从后面追加appendChild
   */
  const patch = (n1, n2, container, anchor = null) => {
    //n1和n2不相同则直接替换元素，只有相同才会diff
    if (n1 && !isSameVnode(n1, n2)) {
      //卸载就节点，初始化新节点
      unmount(n1);
      n1 = null; //会走初始化逻辑
    }

    //n2可能是元素，也可能是组件，需要判断类型
    const { shapeFlag } = n2;
    if (shapeFlag & ShapeFlags.ELEMENT) {
      //是元素
      processElement(n1, n2, container, anchor);
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
