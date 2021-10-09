## 目录结构

```
├── component
│ ├── router-link.js
│ ├── router-view.js
├── history
│ ├── base.js
│ ├── hash.js
│ └── html5.js
├── create-matcher.js
├── create-route-map.js
├── index.js
└── install.js
```

## index

```js
import { install } from './install.js';
import createMatcher from './create-matcher';
import HashHistory from './history/hash';
import HTML5History from './history/html5';

class VueRouter {
  constructor(options) {
    this.matcher = createMatcher(options.routes); // match  addRoute
    this.mode = options.mode || 'hash';

    switch (this.mode) {
      case 'hash':
        this.history = new HashHistory(this);
        break;
      case 'history':
        this.history = new HTML5History(this);
        break;
    }
  }
  match(path) {
    return this.matcher.match(path);
  }
  init(vueRoot) {
    // 匹配出跳转后路径对应的组件
    const history = this.history;

    //页面初始化跳转一次
    history.transitionTo(history.getLocation(), () => {
      history.setUpListener();
    });

    //如果current发生变化，就重新给$route(_route)赋值
    history.listen(route => {
      vueRoot._route = route;
    });
  }
  //路由跳转
  push(path) {
    this.history.transitionTo(path, () => {
      this.history.push(path);
    });
  }
  replace(path) {
    this.history.transitionTo(path, () => {
      this.history.replace(path);
    });
  }
}

VueRouter.install = install;

export default VueRouter;
```

## install

```js
import RouterLink from './components/link';
import RouterView from './components/view';

export let Vue; //暴露Vue，保证Vue版本一致

/* 初始化$router $route  router-link router-view  */
export function install(_Vue) {
  if (install.installed) return;
  Vue = _Vue;
  install.installed = true;

  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        //根实例
        //给根实例添加2个属性,调用VueRouter的init，让每个子组件都能拿到_routerRoot和_routerRoot._router
        this._router = this.$options.router;
        this._routerRoot = this;

        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        //其他组件实例
        this._routerRoot = this.$parent && this.$parent._routerRoot;
      }
    }
  });

  // $router 路由实例
  Object.defineProperty(Vue.prototype, '$router', {
    get() {
      return this._routerRoot._router;
    }
  });
  // $route 当前匹配到的路由记录 {path , matched:[] , params,query,...}
  Object.defineProperty(Vue.prototype, '$route', {
    get() {
      return this._routerRoot._route;
    }
  });

  Vue.component('router-link', RouterLink);
  Vue.component('router-view', RouterView);
}

if (window && window.vue) {
  install(window.vue);
}
```

## createMatcher.js

```js
import createRouteMap from './create-route-map';

export default function createMatcher(routes) {
  //   / home
  //   /about    about
  //   /about/a  aboutA
  //   /about/b  aboutB
  let { pathMap } = createRouteMap(routes); // 创建一个 路径和记录的映射表

  // 在原来的基础上继续添加路由
  function addRoutes(routes) {
    createRouteMap(routes, pathMap);
  }

  function match(path) {
    const record = pathMap[path];
    return createRoute(record, { path });
  }

  return {
    match,
    addRoute: addRoutes,
    addRoutes //已废弃，使用router.addRoute
  };
}

export const createRoute = (record, { path }) => {
  let matched = [];
  if (record) {
    while (record) {
      matched.unshift(record);
      record = record.parent; // 一层层的向上找
    }
  }
  return {
    path,
    matched
  };
};
```

## createRouteMap.js

```js
export default function createRouteMap(routes, pathMap = {}) {
  routes.forEach(route => {
    addRouteRecord(route, pathMap);
  });

  return { pathMap };
}

function addRouteRecord(route, pathMap, parent) {
  let path = parent ? parent.path + route.path : route.path;
  const record = {
    path,
    component: route.component,
    parent
  };
  pathMap[path] = record;
  if (route.children)
    route.children.forEach(childRoute =>
      addRouteRecord(childRoute, pathMap, record)
    );
}
```

## base.js

```js
import { createRoute } from '../create-matcher';

export default class History {
  constructor(vueRouter) {
    this.router = vueRouter;
    //将current属性变成响应式的，如果在渲染router-view时候用到了这个current,等会current变化了就可以重新刷新视图
    this.current = createRoute(null, { path: '/' });
  }
  transitionTo(path, callback) {
    //根据路径匹配组件及父组件
    let record = this.router.match(path);
    // hash模式下会走2次，因为调用transitionTo之后改变hash,监听hash变化又走了1次。所以加个判断，相同路径不再跳转
    if (
      path === this.current.path &&
      record.matched.length === this.current.matched.length
    ) {
      return;
    }

    this.current = record; //改变current
    this.cb && this.cb(this.current); //还有改变_route,使视图更新
    callback && callback();
  }
  listen(cb) {
    this.cb = cb;
  }
}
```

## hash.js

```js
import History from './base';

function getHash() {
  return window.location.hash.slice(1);
}

export default class HashHistory extends History {
  constructor(vueRouter) {
    super(vueRouter);
    //初始化检测hash值 给出默认路径
    if (!window.location.hash) window.location.hash = '/';
  }
  getLocation() {
    return getHash();
  }
  setUpListener() {
    window.addEventListener('hashchange', e => {
      //hash变化 组件渲染
      this.transitionTo(getHash());
    });
  }
  //改变路径
  push(hash) {
    window.location.hash = hash;
  }
  replace(hash) {
    function getUrl(path) {
      const href = window.location.href;
      const i = href.indexOf('#');
      const base = i >= 0 ? href.slice(0, i) : href;
      return `${base}#${path}`;
    }

    window.location.replace(getUrl(hash));
  }
}
```

## html5.js

```js
import History from './base';

export default class HTML5History extends History {
  constructor(router) {
    super(router);
  }
  getLocation() {
    return window.location.pathname;
  }
  setUpListener() {
    window.addEventListener('popstate', () => {
      //hash变化 组件渲染
      this.transitionTo(this.getLocation());
    });
  }
  //改变路径
  push(path) {
    window.history.pushState({}, null, path);
  }
  replace(path) {
    window.history.replaceState({}, null, path);
  }
}
```

## 全局组件 router-link

```js
export default {
  functional: true,
  props: {
    to: {
      type: String,
      required: true
    },
    replace: {
      type: Boolean,
      required: false
    }
  },
  render(h, { props, slots, parent }) {
    function click() {
      props.replace
        ? parent.$router.replace(props.to)
        : parent.$router.push(props.to);
    }
    return <a onClick={click}>{slots().default}</a>;
  }
};
```

## 全局组件 router-view

```js
export default {
  functional: true,
  render(h, { parent, data, props, children }) {
    data.routerView = true; // 标识
    let route = parent.$route; // $route === _route === current
    let depth = 0;
    while (parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++;
      }
      parent = parent.$parent;
    }

    let record = route.matched[depth];
    if (!record) {
      return h();
    }
    return h(record.component, data);
  }
};
```
