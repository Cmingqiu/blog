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
    es2022: true,
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
};
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
    "lint": "eslint --ext .js .vue src --quiet",
    "lint:fix": "eslint --ext .js .vue src --fix --quiet" //--fix自动修正
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
    "typescript",
    "typescriptreact",
    "html",
    "vue",
    "vue-html"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true // 开启保存自动修复的功能
  }
}
```

配置说明，在 ESLint 2.0.4 版本开始：

- 不需要通过 eslint.validate 来指定校验的文件类型了，已经自动支持了 .vue 文件；
- editor.codeActionsOnSave 开启保存自动修复功能；

当这样配置之后呢，每次编辑代码 ESLint 都会实时校验代码，且当保存的时候会自动 fix，是不是很方便呢。不过对于有些无法自动 fix 的代码就需要你手动去修改了，如果不想修改的话就可以配置 rules 把该条规则给关闭掉。

其实在团队开发的时候，最好把针对 VSCode 的配置，写一个文件跟随着项目，一起提交到远程仓库，这样的话就保证了项目成员都是用的这套配置。比如可以在项目根目录新建 .vscode/settings.json，然后写入上面的那串配置内容。

```sh
# eslint-config-airbnb-base 使用 airbnb 代码规范
npm i eslint babel-eslint eslint-config-airbnb-base eslint-plugin-import -D
```

## ts 结合 eslint

```sh
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint typescript
```

```.eslintrc.js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint']
};
```

::: tip
@typescript-eslint/parser 和 @typescript-eslint/eslint-plugin 版本号必须一致
:::

## 配置解读

### 1.配置解析器和解析参数

ESLint 的解析器，早期的时候用的是 [Esprima](http://esprima.org/ 'http://esprima.org/')，后面基于 Esprima v1.2.2 版本开发了一个新的解析器 [Espree](https://github.com/eslint/espree 'https://github.com/eslint/espree')，并且把它当做默认解析器。

除了使用 ESLint 自带的解析器外，还可以指定其他解析器：

- [@babel/eslint-parser](https://github.com/babel/babel/tree/main/eslint/babel-eslint-parser 'https://github.com/babel/babel/tree/main/eslint/babel-eslint-parser')：使 Babel 和 ESLint 兼容，对一些 Babel 语法提供支持；
- [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint 'https://github.com/typescript-eslint/typescript-eslint')：TSLint 被弃用后，TypeScript 提供了此解析器用于将其与 ESTree 兼容，使 ESLint 对 TypeScript 进行支持；

为项目指定某个选择器的原则是什么？

- 如果你的项目用到了比较新的 ES 语法，比如 ES2021 的 Promise.any()，那就可以指定 @babel/eslint-parser 为解析器；
- 如果项目是基于 TS 开发的，那就使用 @typescript-eslint/parser；

> 如果你对 ES 最新标准还不熟悉，可以看看这篇文章：[送你一份精心总结的 3 万字 ES6 实用指南（下）](https://juejin.cn/post/6896986598999588872 'https://juejin.cn/post/6896986598999588872')

除了指定解析器 parser 外，还可以额外配置解析器参数 parserOption：

```js
{
    // ESLint 默认解析器，也可以指定成别的
    parser: "espree",
    parserOption: {
        // 指定要使用的 ECMAScript 版本，默认值 5
        ecmaVersion: 5,
        // 设置为 script (默认) 或 module（如果你的代码是 ECMAScript 模块)
        sourceType: "script",
        // 这是个对象，表示你想使用的额外的语言特性,所有选项默认都是 false
        ecmafeatures: {
            // 是否允许在全局作用域下使用 return 语句
            globalReturn: false,
            // 是否启用全局 strict 模式（严格模式）
            impliedStrict: false,
            // 是否启用JSX
            jsx: false,
            // 是否启用对实验性的objectRest/spreadProperties的支持
            experimentalObjectRestSpread: false
        }
    }
}
```

### 2.指定环境 env

指定不同的环境可以给对应环境下提供预设的全局变量。比如说在 browser 环境下，可以使用 window 全局变量；在 node 环境下，可以使用 process 全局变量等；

ESLint 中可配置的环境比较多，[这里有份完整的环境列表](https://eslint.org/docs/user-guide/configuring/language-options#specifying-environments 'https://eslint.org/docs/user-guide/configuring/language-options#specifying-environments')，下面列出几个比较常见的：

- browser：浏览器全局变量；
- node：Node.js 全局变量和作用域；
- es6：es6 中除了模块之外的其他特性，同时将自动设置 parserOptions.ecmaVersion 参数为 6；以此类推 ES2017 是 7，而 ES2021 是 12；
- es2017：parserOptions.ecmaVersion 为 8；
- es2020：parserOptions.ecmaVersion 为 11；
- es2021：parserOptions.ecmaVersion 为 12；

配置方式如下：

```js
{
    env: {
        browser: true,
        node: true,
        es6: true,
        commonjs: true,
        mocha: true,
        jquery: true,
    }
}
```

可以指定多个环境并不意味着配置的环境越多越好，实际配置的时候还是得依据当前项目的环境来选择。

### 3.配置全局变量 globals

ESLint 的一些核心规则依赖于对代码在运行时可用的全局变量的了解。 由于这些在不同环境之间可能会有很大差异，并且在运行时会进行修改，因此 ESLint 不会假设你的执行环境中存在哪些全局变量。

如果你想使用这些全局变量，那就可以通过 globals 来指定。比如在 [react .eslintrc.js](https://github.com/facebook/react/blob/master/.eslintrc.js 'https://github.com/facebook/react/blob/master/.eslintrc.js') 里就把 spyOnDev、 spyOnProd 等变量挂在了 global 下作为全局变量：

```js
{
    globals: {
        spyOnDev: true,
        spyOnProd: true,
    }
}
```

对于它的值需要特别说明下：

- false、readable、readonly 这 3 个是等价的，表示变量只可读不可写；
- true、writeable、writable 这 3 个是等价的，表示变量可读可写；

### 4.配置扩展 extends

实际项目中配置规则的时候，不可能团队一条一条的去商议配置，太费精力了。通常的做法是使用业内大家普通使用的、遵循的编码规范；然后通过 extends 去引入这些规范。extends 配置的时候接受字符串或者数组：

```js
{
    extends: [
        'eslint:recommended',
        'plugin:vue/essential',
        'eslint-config-standard', // 可以缩写成 'standard'
        '@vue/prettier',
        './node_modules/coding-standard/.eslintrc-es6'
    ]
}
```

**从上面的配置，可以知道 extends 支持的配置类型可以是以下几种**

- eslint 开头的：是 ESLint 官方的扩展；
- plugin 开头的：是插件类型扩展，比如 plugin:vue/essential；
- eslint-config 开头的：来自 npm 包，使用时可以省略前缀 eslint-config-，比如上面的可以直接写成 standard；
- @开头的：扩展和 eslint-config 一样，只是在 npm 包上面加了一层作用域 scope；
- 一个执行配置文件的相对路径或绝对路径；

**那有哪些常用的、比较著名扩展可以被 extends 引入呢**

- [eslint:recommended](https://eslint.org/docs/rules/ 'https://eslint.org/docs/rules/')：ESLint 内置的推荐规则，即 ESLint Rules 列表中打了钩的那些规则；
- [eslint:all](https://eslint.org/docs/rules/ 'https://eslint.org/docs/rules/')：ESLint 内置的所有规则；
- [eslint-config-standard](https://github.com/standard/eslint-config-standard 'https://github.com/standard/eslint-config-standard')：standard 的 JS 规范；
- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier 'https://github.com/prettier/eslint-config-prettier')：关闭和 ESLint 中以及其他扩展中有冲突的规则；
- [eslint-config-airbnb-base](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base 'https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base')：airbab 的 JS 规范；
- [eslint-config-alloy](https://github.com/AlloyTeam/eslint-config-alloy 'https://github.com/AlloyTeam/eslint-config-alloy')：腾讯 AlloyTeam 前端团队出品，可以很好的针对你项目的技术栈进行配置选择，比如可以选 React、Vue（现已支持 Vue 3.0）、TypeScript 等；

### 5.使用插件 plugins

**ESLint 提供插件是干嘛用的**

ESLint 虽然可以定义很多的 rules，以及通过 extends 来引入更多的规则，但是说到底只是检查 JS 语法。如果需要检查 Vue 中的 template 或者 React 中的 jsx，就束手无策了。 所以引入插件的目的就是为了增强 ESLint 的检查能力和范围。

**如何配置插件**

ESLint 相关的插件的命名形式有 2 种：不带命名空间的和带命名空间的，比如：

- eslint-plugin- 开头的可以省略这部分前缀；
- @/ 开头的；

```js
{
  plugins: [
    'jquery', // 是指 eslint-plugin-jquery
    '@jquery/jquery', // 是指 @jquery/eslint-plugin-jquery
    '@foobar' // 是指 @foobar/eslint-plugin
  ];
}
```

当需要基于插件进行 extends 和 rules 的配置的时候，需要加上插件的引用，比如：

```js
{
    plugins: [
        'jquery',   // eslint-plugin-jquery
        '@foo/foo', // @foo/eslint-plugin-foo
        '@bar,      // @bar/eslint-plugin
    ],
    extends: [
        'plugin:jquery/recommended',
        'plugin:@foo/foo/recommended',
        'plugin:@bar/recommended'
    ],
    rules: {
        'jquery/a-rule': 'error',
        '@foo/foo/some-rule': 'error',
        '@bar/another-rule': 'error'
    },
}
```

以上配置来自 [ESLint plugins](https://eslint.org/docs/user-guide/configuring/plugins#configuring-plugins 'https://eslint.org/docs/user-guide/configuring/plugins#configuring-plugins')

### 6.配置规则 rules

ESLint 提供了大量内置的规则，这里是它的规则列表 [ESLint Rules](https://eslint.org/docs/rules/ 'https://eslint.org/docs/rules/')，除此之外你还可以通过插件来添加更多的规则。

**规则的校验说明，有 3 个报错等级**

- off 或 0：关闭对该规则的校验；
- warn 或 1：启用规则，不满足时抛出警告，且不会退出编译进程；
- error 或 2：启用规则，不满足时抛出错误，且会退出编译进程；

通常规则只需要配置开启还是关闭即可；但是也有些规则可以传入属性，比如：

```js
{
    rules: {
        'quotes': ['error', 'single'],  // 如果不是单引号，则报错
        'one-var': ['error', {
            'var': 'always',  // 每个函数作用域中，只允许 1 个 var 声明
            'let': 'never',   // 每个块作用域中，允许多个 let 声明
            'const': 'never', // 每个块作用域中，允许多个 const 声明
        }]
    }
}
```

如何知道某个扩展有哪些规则可以配置，以及每个规则具体限制？ 这里直接给出业内著名且使用比较多的规则列表的快速链接：

- [ESLint rules](https://eslint.org/docs/rules/ 'https://eslint.org/docs/rules/')，这整个列表对应 eslint:all，而打钩 ✔️ 的是 eslint:recommenmed；
- [Prettier rules](https://github.com/prettier/eslint-config-prettier/blob/main/index.js 'https://github.com/prettier/eslint-config-prettier/blob/main/index.js')
- [standard rules](https://github.com/standard/standard/blob/master/RULES.md 'https://github.com/standard/standard/blob/master/RULES.md')
- [airbnb rules](https://github.com/airbnb/javascript 'https://github.com/airbnb/javascript')
- [AlloyTeam vue rules](https://github.com/AlloyTeam/eslint-config-alloy/blob/master/config/rules/vue.json 'https://github.com/AlloyTeam/eslint-config-alloy/blob/master/config/rules/vue.json')

**规则的优先级**

- 如果 extends 配置的是一个数组，那么最终会将所有规则项进行合并，出现冲突的时候，后面的会覆盖前面的；
- 通过 rules 单独配置的规则优先级比 extends 高；

### 7.其他配置

**配置当前目录为 root**

ESLint 检测配置文件步骤：

- 1.  在要检测的文件同一目录里寻找 .eslintrc.\* 和 package.json；
- 2.  紧接着在父级目录里寻找，一直到文件系统的根目录；
- 3.  如果在前两步发现有 root：true 的配置，停止在父级目录中寻找 .eslintrc；
- 4.  如果以上步骤都没有找到，则回退到用户主目录 ~/.eslintrc 中自定义的默认配置；

通常我们都习惯把 ESLint 配置文件放到项目根目录，因此可以为了避免 ESLint 校验的时候往父级目录查找配置文件，所以需要在配置文件中加上 root: true。

```js
{
    root: true,
}
```

**添加共享数据**

ESLint 支持在配置文件添加共享设置，你可以添加 settings 对象到配置文件，它将提供给每一个将被执行的规则。如果你想添加的自定义规则而且使它们可以访问到相同的信息，这将会很有用，并且很容易配置：

```js
{
    settings: {
        sharedData: 'Hello'
    },
}
```

参考：[ESLint 配置文件.eslintrc 参数说明](https://gist.github.com/rswanderer/29dc65efc421b3b5b0442f1bd3dcd046 'https://gist.github.com/rswanderer/29dc65efc421b3b5b0442f1bd3dcd046')

**针对个别文件设置新的检查规则**

比如 webpack 的中包含了某些运行时的 JS 文件，而这些文件是只跑在浏览器端的，所以需要针对这部分文件进行差异化配置：

```js
overrides: [
  {
    files: ['lib/**/*.runtime.js', 'hot/*.js'],
    env: {
      es6: false,
      browser: true
    },
    globals: {
      Promise: false
    },
    parserOptions: {
      ecmaVersion: 5
    }
  }
];
```

以上配置来自 [webpack .eslintrc.js](https://github.com/webpack/webpack/blob/master/.eslintrc.js 'https://github.com/webpack/webpack/blob/master/.eslintrc.js')

## 如何校验

上面细说了 ESLint 的各种配置项，以及针对 Vue 项目如何进行差异配置的说明。

现在我们知道了如何配置，但是你知道这些配置都是配置到哪里的吗？

### 配置方式

ESLint 支持 3 种配置方式：

- 命令行：不推荐，不做介绍；
- 单文件内注释：不推荐，不做介绍；
- 配置文件：配置文件的类型可以是好几种，比如：.js、.yml、json 等。推荐使用 .eslintrc.js；

下面通过命令来生成一个配置文件：

```bash
# 安装 eslint
npm i eslint -D

# 初始化一个配置文件
npx eslint --init
```

最后会在当前目录生成一个 .eslintrc.js 文件。这里就不把代码贴出来了，没参考意义。

上面我们知道了可以将配置统一写到一个配置文件里，但是你知道该如何去触发这个配置文件的校验规则嘛？

### 校验单个文件

```js
// 校验 a.js 和 b.js
npx eslint a.js b.js

// 校验 src 和 scripts 目录
npx eslint src scripts
```

### 校验别的类型的文件

通常 ESLint 只能校验 JS 文件。比如需要校验 .vue 文件，光配置 vue 插件和 vue-eslint-parser 解析器是不够的，还需要让 ESLint 在查找文件的时候找到 .vue 文件。

可以通过 --ext 来指定具体需要校验的文件：

```bash
npx eslint --ext .js,.jsx,.vue src
```

### 自动修复部分校验错误的代码

rules 列表项中标识了一个扳手 🔧 图案的规则就标识该规则是可以通过 ESLint 工具自动修复代码的。 如何自动修复呢？通过 --fix 即可。比如对于 ESLint Rules 里的这个 [semi](https://eslint.org/docs/rules/semi 'https://eslint.org/docs/rules/semi') 规则，它就是带扳手图案的。

对于如下的 a.js 代码：

```js
const num = 12;
```

当在配置文件配置了 'semi': \[2, 'always'\] 后，运行命令：

```bash
npx eslint --fix a.js
```

校验直接就通过了，且会自动修复代码，在代码末尾自动加上分号。

### 把校验命令加到 package.json

检验命令比较长，也难记，习惯上会把这些命名直接写到 package.json 里：

```json
{
  "scripts": {
    "lint": "npx eslint --ext .js,.jsx,.vue src",
    "lint:fix": "npx eslint --fix --ext .js,.jsx,.vue src"
  }
}
```

### 过滤一些不需要校验的文件

对于一些公共的 JS、测试脚本或者是特定目录下的文件习惯上是不需要校验的，因此可以在项目根目录通过创建一个 .eslintignore 文件来配置，告诉 ESLint 校验的时候忽略它们：

```auto
public/
src/main.js
```

除了 .eslintignore 中指定的文件或目录，ESLint 总是忽略 /node_modules/ 和 /bower_components/ 中的文件；因此对于一些目前解决不了的规则报错，但是如果又急于打包上线，在不影响运行的情况下，我们就可以利用 .eslintignore 文件将其暂时忽略。

## 在 Vue 项目中的实践

上面把 ESLint 的几乎所有的配置参数和校验方式都详细的介绍了一遍，但是如果想在项目中落地，仅仅靠上面的知识还是不够的。下面将细说如何在 Vue 中落地代码校验。

关于如何在 Vue 中落地代码校验，一般是有 2 种情况：

- 通过 vue-cli 初始化项目的时候已经选择了对应的校验配置
- 对于一个空的 Vue 项目，想接入代码校验

其实这 2 种情况最终的校验的核心配置都是一样的，只是刚开始的时候安装的包有所区别。下面通过分析 vue-cli 配置的代码校验，来看看它到底做了哪些事情，通过它安装的包以及包的作用，我们就会知道如何在空项目中配置代码校验了。

### 通过 vue-cli 初始化的项目

如果你的项目最初是通过 vue-cli 新建的，那么在新建的时候会让你选

- 是否支持 eslint；
- 是否开启保存校验；
- 是否开启提交前校验；

如果都开启了话，会安装如下几个包：

- eslint：前面 2 大章节介绍的就是这玩意，ESLint 出品，是代码校验的基础包，且提供了很多内置的 Rules，比如 eslint:recommended 经常被作为项目的 JS 检查规范被引入；
- babel-eslint：一个对 Babel 解析器的包装，使其能够与 ESLint 兼容；
- lint-staged：请看后面 pre-commit 部分；
- @vue/cli-plugin-eslint
- eslint-plugin-vue

下面重点介绍 @vue/cli-plugin-eslint 和 eslint-plugin-vue，说下这 2 个包是干嘛的。

#### @vue/cli-plugin-eslint

这个包它主要干了 2 件事情：

**第一件事**

往 package.json 里注册了一个命令：

```json
{
  "scripts": {
    "lint": "vue-cli-service lint"
  }
}
```

执行这个命令之后，它会去检查和修复部分可以修复的问题。默认查找的文件是 src 和 tests 目录下所有的 .js,.jsx,.vue 文件，以及项目根目录下所有的 js 文件（比如，也会检查 .eslintrc.js）。

当然你也可以自定义的传入参数和校验文件：

```bash
vue-cli-service lint [options] [...files]
```

支持的参数如下：

- \--no-fix: 不会修复 errors 和 warnings；
- \--max-errors \[limit\]：指定导致出现 npm ERR 错误的最大 errors 数量；

**第二件事**

增加了代码保存触发校验的功能 lintOnSave，这个功能默认是开启的。如果想要关闭这个功能，可以在 vue.config.js 里配置，习惯上只开启 development 环境下的代码保存校验功能：

```js
module.exports = {
  lintOnSave: process.env.NODE_ENV === 'development'
};
```

lintOnSave 参数说明：

- true 或者 warning：开启保存校验，会将 errors 级别的错误在终端中以 WARNING 的形式显示。默认的，WARNING 将不会导致编译失败；
- false：不开启保存校验；
- error：开启保存校验，会将 errors 级别的错误在终端中以 ERROR 的形式出现，会导致编译失败，同时浏览器页面变黑，显示 Failed to compile。

#### eslint-plugin-vue

eslint-plugin-vue 是对 .vue 文件进行代码校验的插件。

**针对这个插件，它提供了这几个扩展**

- plugin:vue/base：基础
- plugin:vue/essential：预防错误的（用于 Vue 2.x）
- plugin:vue/recommended：推荐的，最小化任意选择和认知开销（用于 Vue 2.x）；
- plugin:vue/strongly-recommended：强烈推荐，提高可读性（用于 Vue 2.x）；
- plugin:vue/vue3-essential：（用于 Vue 3.x）
- plugin:vue/vue3-strongly-recommended：（用于 Vue 3.x）
- plugin:vue/vue3-recommended：（用于 Vue 3.x）

各扩展规则列表：[vue rules](https://eslint.vuejs.org/rules/ 'https://eslint.vuejs.org/rules/')

**看到这么一堆的扩展，是不是都不知道选哪个了**

代码规范的东西，原则还是得由各自的团队去磨合商议出一套适合大家的规则。不过，如果你用的是 Vue2，我这里可以推荐 2 套 extends 配置：

```js
{
    // Vue 官方示例上的配置
   extends: ['eslint:recommended', 'plugin:vue/recommended'],

   // 或者使用 AlloyTeam 团队那套
   extends: ['alloy', 'alloy/vue']
}
```

**配置和插件对应的解析器**

如果是 Vue 2.x 项目，配置了 eslint-plugin-vue 插件和 extends 后，template 校验还是会失效，因为不管是 ESLint 默认的解析器 Espree 还是 babel-eslint 都只能解析 JS，无法解析 template 的内容。

而 vue-eslint-parser 只能解析 template 的内容，但是不会解析 JS，因此还需要对解析器做如下配置：

```js
{
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: 'babel-eslint',
        ecmaVersion: 12,
        sourceType: 'module'
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/recommended'
    ],
    plugins: ['vue']
}
```

参考：[eslint-plugin-vue faq](https://eslint.vuejs.org/user-guide/#faq 'https://eslint.vuejs.org/user-guide/#faq')

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
};
```

- 配置了 standard 后，还能自定义 rules 吗？  
  standard 本身是不赞成这样做的，如果你一定要使用 standard 并需要对其中某些规则进行自定义的话，你需要使用 eslint-config-standard，当然， 在上面我们执行的 ESLint init 指令安装的配置中，就是以这种形式使用 standard 的。
