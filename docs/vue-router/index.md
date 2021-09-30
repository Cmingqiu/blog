## 目录结构

```
├── component
│ ├── router-link
│ ├── router-view
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

    const setUpListener = () => {
      history.setUpListener();
    };
    //页面初始化跳转一次
    history.transitionTo(history.getLocation(), setUpListener);

    history.listen(route => {
      vueRoot._route = route;
    });
  }
  //路由跳转
  push(path) {
    this.history.transitionTo(path, () => {
      this.history.pushState(path);
    });
  }
  replace() {}
}

VueRouter.install = install;

export default VueRouter;
```

## install

```js
import RouterLink from './components/link';
import RouterView from './components/view';

export let Vue;
/* 初始化$router $route  router-link router-view  */
export function install(_Vue) {
  if (install.installed) return;
  Vue = _Vue;
  install.installed = true;

  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        //根实例
        //给根实例添加2个属性,调用VueRouter的init
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

  Object.defineProperty(Vue.prototype, '$router', {
    get() {
      return this._routerRoot._router;
    }
  });
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
  //   / hoime
  //   /about   about
  //  /about/a  aboutA
  //  /about/b  aboutB
  //创建路径和记录的映射表
  let { pathMap } = createRouteMap(routes);

  function match(path) {
    let record = pathMap[path];
    if (record) {
    }
    return pathMap[path];
  }

  function addRoutes(routes) {
    createRouteMap(routes, pathMap);
  }

  return { match, addRoutes };
}
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
export default class History {
  constructor(vueRouter) {
    this.router = vueRouter;
    this.current = createRoute(null, { path: '/' });
  }
  transitionTo(path, cb) {
    //根据路径匹配组件及父组件s
    let record = this.router.match(path);
    let currentRoute = createRoute(record, { path });
    if (
      path === this.current.path &&
      currentRoute.matched.length === this.current.matched.length
    )
      return;

    this.current = currentRoute;
    this.cb && this.cb(currentRoute);
    cb && cb();
  }
  listen(cb) {
    this.cb = cb;
  }
}

function createRoute(record, location) {
  let matched = [];
  if (record) {
    while (record) {
      matched.unshift(record);
      record = record.parent;
    }
  }
  return {
    ...location,
    matched
  };
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
  pushState(hash) {
    window.location.hash = hash;
  }
}
```

## history.js

```js
import History from './base';

export default class HTML5History extends History {
  constructor(router) {
    super(router);
  }

  getLocation() {
    return window.location.pathname;
  }

  setUpListener(path) {
    window.addEventListener('popstate', () => {
      //hash变化 组件渲染
      this.transitionTo(this.getLocation());
    });
  }
  //改变路径
  pushState(path) {
    window.history.pushState({}, null, path);
  }
}
```

## 全局组件 router-link

```js
export default {
  functional: true,
  props: {
    to: String,
    required: true
  },
  render(h, { props, slots, parent }) {
    function click() {
      parent.$router.push(props.to);
    }
    return <a onClick={click}>{slots().default}</a>;
  }
};
```

## 全局组件 router-view

```js
export default {
  functional: true,
  render(h, { parent, data }) {
    let route = parent.$route;
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

    data.routerView = true;
    return h(record.component, data);
  }
};
```
