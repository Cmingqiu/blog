## js 的最佳实践

```sh
pnpm i
  eslint prettier eslint-plugin-prettier eslint-config-prettier
-D
```

.eslintrc.js

```js
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest', //默认script，允许es高级语法
    ecmaFeatures: {
      jsx: true, // 支持jsx写法
      globalReturn: false, // 是否允许在全局作用域下使用 return 语句
      impliedStrict: false, // 是否启用全局 strict 模式（严格模式）
      experimentalObjectRestSpread: false // 是否启用对实验性的objectRest/spreadProperties的支持
    }
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended' /* 放在最后 */],
  plugins: [],
  rules: {},
  globals: {
    defineProps: 'readonly'
  }
};
```

prettierrc.js

```js
module.exports = {
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'none',
  arrowParens: 'avoid'
};
```

## ts 的最佳实践

```sh
pnpm i
  typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin
-D
```

.eslintrc.js

```js {8,21,24}
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true
  },
+  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest', //默认script，允许es高级语法
    ecmaFeatures: {
      jsx: true, // 支持jsx写法
      // globalReturn: false, // 是否允许在全局作用域下使用 return 语句
      // impliedStrict: false, // 是否启用全局 strict 模式（严格模式）
      // experimentalObjectRestSpread: false // 是否启用对实验性的objectRest/spreadProperties的支持
    }
  },
  extends: [
    'eslint:recommended',
+   'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended' /* 放在最后 */
  ],
+ plugins: ['@typescript-eslint'],
  rules: {},
  globals: {
    defineProps: 'readonly'
  }
};
```

tsconfig.json

```js
{
  "compilerOptions": {
    "target": "esnext", // 指定编译后的js最低支持的语法
    "module": "esnext",
    "moduleResolution": "node", //使用node解析路径，可以识别/下面的index文件
    "strict": true,
    "jsx": "preserve",
    "sourceMap": true,
    "resolveJsonModule": true, //允许引用json文件
    "esModuleInterop": true, //为导入内容创建命名空间,实现 CommonJS 和 ES 模块之间的互相访问
    "skipLibCheck": true,
    "allowJs": true, //否则volar会报错
    "lib": ["esnext", "dom", "ES2018.Promise"],
    // "types": ["vite/client"], // 可以使用vite内置语法，比如import.meta
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "#/*": ["types/*"]
    }
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.d.ts",
    "src/**/*.vue",
    "vite.config.ts",
    "types/**/*.d.ts",
    "types/**/*.ts",
    "mock/**/*.ts",
    "build/**/*.ts",
    "build/**/*.d.ts"
  ],
  "exclude": ["node_modules", "dist"]
}

```

## 配置脚本

package.json  
检查 src 和 scripts 目录下的 .js 与.vue 文件并自动修复

```json
{
  ...
  "scripts": {
    "line": "eslint src scripts --ext .js,.vue",
    "line:fix": "eslint src scripts --ext .js,.vue --fix"
  },
}
```

:::tip 注意
--ext 只有在参数为目录时，才生效。  
如果你使用 glob 模式或文件名，--ext 将被忽略
例如，eslint lib/\* --ext .js 将匹配 lib/ 下的所有文件，忽略扩展名。
:::

## 忽略文件

.eslintignore

```
*.sh
node_modules
dist
*.md
*.woff
*.ttf
.vscode
.idea
/public
/docs
.husky
.local
/bin
Dockerfile

*.css
*.jpg
*.jpeg
*.png
*.gif
*.d.ts
```

.eslintignore

```
node_modules
dist
```
