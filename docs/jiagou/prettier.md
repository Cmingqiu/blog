## Prettier 是什么

Prettier 是一款代码格式化工具，用于检测代码中的格式问题，比如单行代码长度、tab 长度、空格、逗号表达式等。在功能职责上，ESlint 偏向于把控项目的代码质量，而 Prettier 更偏向于统一项目的编码风格。  
在 ESlint 推出 --fix 参数前，ESLint 并没有自动化格式代码的功能，要对一些格式问题做批量格式化只能用 Prettier 这样的工具。并且，Prettier 在代码风格的检测上比 ESlint 更全面，所以两者通常是结合在一起使用的。

支持的文件类型很多，比如：

- JavaScript（包括实验中的特性）
- JSX
- Vue
- TypeScript
- CSS、Less、SCSS
- HTML
- JSON
- Markdown
- ...

## Prettier 对比 ESLint

我们知道 ESLint 负责了对代码的校验功能，并且主要提供了 2 类规则：

- 检查格式化的规则
- 检查代码质量的规则

说到底 ESLint 就是通过一条条的规则去限制代码的规范，但是这些规则毕竟是有限的，而且更重要的是这些规则的重点并不在代码风格上，所以单凭 ESLint 并不能完全的统一代码风格。
这个时候就需要引入 Prettier 了，因为它干的事就是只管代码格式化，不管代码质量。

> Prettier：在代码风格这一块，我一直拿捏的死死的。

## 安装

```sh
pnpm add prettier -D
```

Prettier 支持可以配置参数不多，总共才 21 个，这里是所有参数的说明 [prettier options](https://prettier.io/docs/en/options.html#print-width)

所有参数都有默认值，也就是说即使你没有配置 .prettierrc.js，当你用 Prettier 去格式化代码的时候全部都会走默认配置。针对个别参数，你不想用默认设置的话，就可以在 .prettierrc.js 配置具体想要的值。

如下，把项目中会用到的参数进行一个说明：

```js
module.exports = {
  printWidth: 80, //（默认值）单行代码超出 80 个字符自动换行
  tabWidth: 2, //（默认值）一个 tab 键缩进相当于 2 个空格
  useTabs: true, // 行缩进使用 tab 键代替空格
  semi: false, //（默认值）语句的末尾加上分号
  singleQuote: true, // 使用单引号
  quoteProps: 'as-needed', //（默认值）仅仅当必须的时候才会加上双引号
  jsxSingleQuote: true, // 在 JSX 中使用单引号
  trailingComma: 'all', // 不用在多行的逗号分隔的句法结构的最后一行的末尾加上逗号
  bracketSpacing: true, //（默认值）在括号和对象的文字之间加上一个空格
  jsxBracketSameLine: true, // 把 > 符号放在多行的 JSX 元素的最后一行
  arrowParens: 'avoid', // 当箭头函数中只有一个参数的时候可以忽略括弧
  htmlWhitespaceSensitivity: 'ignore', // vue template 中的结束标签结尾尖括号掉到了下一行
  vueIndentScriptAndStyle: false, //（默认值）对于 .vue 文件，不缩进 <script> 和 <style> 里的内容
  embeddedLanguageFormatting: 'auto' //（默认值）允许自动格式化内嵌的代码块
}
```

扩展阅读：关于 [Trailing commas](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Trailing_commas#trailing_commas_in_functions) 你或许想了解更多。

然后可以通过命令来格式化代码：

```sh
# 将格式化当前目录及子目录下所有文件
npx prettier --write .

# 检查某个文件是否已经格式化
npx prettier --check src/main.js
```

如果有些文件不想被 Prettier 格式化，可以将其写入到 .prettierignore 里：

```js
node_modules
build/
package.json
public/
test/*.*
```

## Prettier 结合 ESLint

上面介绍了 Prettier 的具体配置，这里主要介绍和 ESLint 结合使用的配置和注意事项。
和 ESLint 配合使用需要用到 eslint-plugin-prettier 这个插件：

```sh
npm i eslint-plugin-prettier -D
```

配置：

```js
{
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': 'error'
    }
}
```

这个插件的工作原理是:  
**先调用 Prettier 对你的代码进行格式化，然后会把格式化前后不一致的地方进行标记，通过配置 'prettier/prettier': 'error' 此条规则会将标记地方进行 error 级别的报错提示，然后可以通过 ESLint 的 --fix 自动修复功能将其修复。**

冲突了怎么办  
通过前面的介绍，我们知道 ESLint 也是会对代码风格做一些限制的，而 Prettier 主要就是规范代码风格，所以在把它们结合一起使用的时候是存会在一些问题的。对于个别规则，会使得双方在校验后出现代码格式不一致的问题。
那么当 Prettier 和 ESLint 出现冲突之后，该怎么办呢？  
用 Prettier 的话来说很简单，只要使用 eslint-config-prettier 就可以了。解决冲突的思路就是通过将这个包提供的扩展放到 extends 最后面引入，依据 rules 生效的优先级，所以它会覆盖前面起冲突的规则，比如：

```js
{
  extends: [
    'eslint:recommended',
    'prettier', // 必须放最后
  ]
}
```

除了能覆盖和 ESLint 中起冲突的规则之外，eslint-config-prettier 还能覆盖来自以下插件的规则（只列了部分）：

- **eslint-plugin-standard**
- **eslint-plugin-vue**

那 eslint-config-prettier 到底提供了哪些覆盖规则呢？直接看这个列表：[eslint-config-prettier rules](https://github.com/prettier/eslint-config-prettier/blob/main/index.js)  
如果想覆盖某些插件的规则，需要引入对应插件的扩展，比如：

```js
{
  extends: [
    'standard',
    'plugin:vue/recommended',
    'prettier/standard', // 覆盖 eslint-config-stanard
    'prettier/vue', // 覆盖 eslint-plugin-vue
  ]
}
```

> 提示：在 eslint-config-prettier 8.0.0 版本后，extends 不再需要为单独的插件引入对应扩展来覆盖冲突了，统一引入 'prettier' 即可。

如果同时使用了 eslint-plugin-prettier 和 eslint-config-prettier 可以这么配置：

```js
{
  extends: ['plugin:prettier/recommended'],
}
```

它其实和下面这些配置是等价的：

```js
{
  extends: ['prettier'], // eslint-config-prettier 提供的，用于覆盖起冲突的规则
  plugins: ['prettier'], // 注册 eslint-plugin-prettier 插件
  rules: {
    'prettier/prettier': 'error',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off'
  }
}
```

所以如果是在 Vue 2 项目中配置 ESLint 和 Prettier 会这么配置：

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
    'plugin:vue/recommended',
    'plugin:prettier/recommended', // 在前面 Vue 配置的基础上加上这行
  ],
  plugins: ['vue']
}
```

其实如果你的项目是用 vue-cli 初始化的，且选择了 eslint + prettier 方案的话，生成的项目中，.eslintrc.js 配置文件中 extends 的配置是这样的：

```js
{
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/prettier'
  ]
}
```

它的最后一项扩展是 @vue/prettier，这个对应的是 @vue/eslint-config-prettier 这个包，让我们看看这个包下面的 index.js 内容：

```js
{
  plugins: ['prettier'],
  extends: [
    require.resolve('eslint-config-prettier'),
    require.resolve('eslint-config-prettier/vue')
  ],
  rules: {
    'prettier/prettier': 'warn'
  }
}
```

这个和我们上面配置的内容是相差无几的，而引入 eslint-config-prettier/vue 是因为这个 @vue/eslint-config-prettier 包依赖的 eslint-config-prettier 版本是 ^6.0.0 版本的，所以在处理冲突的时候需要特别指定和对应类型插件匹配的扩展。
