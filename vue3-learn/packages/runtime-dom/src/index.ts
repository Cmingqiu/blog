// 抹平平台之间的差异，创建支持dom操作的api

import { createRenderer } from '@vue/runtime-core';
import { extend } from '@vue/shared';
import { nodeOps } from './nodeOps';
import { patchProp } from './patchProp';

const rendererOptions = extend(nodeOps, { patchProp });

export const createApp = (component, props) => {
  let app = createRenderer(rendererOptions).createApp(component, props);
  let { mount } = app;
  app.mount = function(container) {
    container = rendererOptions.querySelector(container);
    container.innerHTML = ''; //挂在之前先清空容器
    mount(container);
  };
  return app;
};
