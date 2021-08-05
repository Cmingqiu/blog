import { createVnode } from "./vnode";


export function createAppAPI (render) {
  return (rootComponent, props) => {
    let app = {
      _component: rootComponent,
      _props: props,
      _container: null,
      //...全局的方法 app.component  app.directive

      mount (container) {
        app._container = container;
        //执行mount的时候
        //1.先根据组件生产vnode虚拟节点
        //2.然后调用render(vnode) 转成真实节点,插入到容器中
        let vnode = createVnode(rootComponent, props);
        render(vnode, container);
      }
    };
    return app;
  };
}
