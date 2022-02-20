ESLint 是一个语法规则和代码风格的检查工具，可以用来保证写出语法正确、风格统一的代码。不管是多人合作还是个人项目，代码规范是很重要的。这样做不仅可以很大程度地避免基本语法错误，也保证了代码的可读性。  
使用 `eslint` 可以检查代码 符不符合团队制订的规范，下面来看一下如何配置 eslint 来检查代码。

## 安装

```sh
npm i eslint -D
```

## 配置文件

新建.eslintrc.js 文件

```js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  // globals: {
  //   ga: true,
  //   chrome: true,
  //   __DEV__: true
  // },
  extends: 'eslint:recommended',
  // extends: ['standard'],
  // extends: [
  //   'plugin:json/recommended',
  //   'plugin:vue/vue3-essential',
  //   'eslint:recommended',
  //   '@vue/prettier'
  // ],
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  rules: {
    // "no-console":   "warn",
    // "no-debugger":   "error",
    //  // 要求使用分号
    // "semi": ["error", "always"],
    // // 强制使用一致的反勾号、双引号或单引号
    // "quotes": ["error", "double"]
    // 'prettier/prettier': 'error'
  }
}
```

忽略文件.eslintignore

```
node_modules
dist
```

## 脚本执行

```json
{
  "script": {
    "lint": "eslint --ext .js .vue --fix" //--fix自动修正
  }
}
```

## vscode 配置 settings.json

在项目根目录新建文件`.vscode/settoings.json`，保存的时候自动按照`.eslintrc.js`修正（npx eslint --init 之后会生成一个.eslintrc.js 的一个文件）

```json
{
  "eslint.validate": [
    "javascript", //  用eslint的规则检测js文件
    "javascriptreact",
    "html",
    "vue"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true // 开启保存自动修复的功能
  }
}
```

```js
// eslint-config-airbnb-base 使用 airbnb 代码规范
npm i eslint babel-eslint eslint-config-airbnb-base eslint-plugin-import -D
```

## 使用第三方规范配置

应用了 ESLint 后，通常是需要自己来配置繁杂的 rules 规则，这也是一个喜好类的东西，多数人是不愿意在这上面耗费太多精力的（比如手动配置数百个 ESLint 规则），于是 github 上出现了一些开源的代码规范库，比较流行的有 airbnb、standard、prettier 等

第三方代码规范 :

- eslint 默认推荐 recommended

- standard (24.5k star)  
  standard 是基于 ESlint Recommend 衍生出来的更严格的规范。这个规范和 recommended 大概有 88 处不同，主要是 recommended 很多都是 off, standard 是 error, 比如 单行代码块两边加空格、禁止使用分号结尾。

- airbnb  
  airbnb 规范是最严格的 ESlint 规范，列出下面几点比较明显的区别：
  - 默认必须要分号，而 eslint 默认不添加分号
  - 不能使用 for 循环，推荐使用数组自带的 API 完成遍历工作。
  - 当你必须使用函数表达式（或传递一个匿名函数）时，使用箭头函数符号。

除了这些以外，还有更多严格的规则，可以查看 [Airbnb 规范](https://github.com/yuche/javascript) 。

- 百度前端编码规范 3.9k

## standard

```sh
 npm i standard eslint-plugin-standard eslint-config-standard -D
```

```js
//.eslintrc.js
module.exports = {
  root: true,
  extends: ['standard']
}
```

- 配置了 standard 后，还能自定义 rules 吗？  
  standard 本身是不赞成这样做的，如果你一定要使用 standard 并需要对其中某些规则进行自定义的话，你需要使用 eslint-config-standard，当然， 在上面我们执行的 ESLint init 指令安装的配置中，就是以这种形式使用 standard 的。
