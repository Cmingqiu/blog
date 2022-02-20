## \* 配置 git message 校验

> 前提：关联了远程仓库

### 1.安装 husky 和 commitlint

```sh
cnpm i husky @commitlint/config-conventional @commitlint/cli -D
```

### 2.新建 commitlint 配置文件

新建 commitlint.config.js 配置文件,输入：

```js
module.exports = { extends: ['@commitlint/config-conventional'] }
```

### 3.husky 初始化

激活开启 husky ，执行完会看到根目录下生成.husky 文件夹 ,里面会保存 husky add 增加的 hook 文件

```sh
npx husky install
```

### 4.新增 hooks 钩子

用 husky 添加一个 commit-msg hook 代码提交时用来执行 commitlint 命令
提交操作执行`git commit -m`会触发 husky`commit-msg`钩子，使用`@commitlint/config-conventiona`校验提交信息;

```sh
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

再添加一个 pre-commit hook 代码提交时 用来执行 lint-staged 命令

```sh
npx husky add .husky/pre-commit 'npx --no-install lint-staged'
```

## \* lint-staged

在代码提交之前，进行代码规则检查能够确保进入 git 库的代码都是符合代码规则的。但是整个项目上运行 lint 速度会很慢，lint-staged 能够让 lint 只检测暂存区的文件，所以速度很快。

```sh
cnpm install lint-staged -D
```

package.json 中配置：

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.js": "eslint --fix"
  }
}
```

git commit 时触发 pre-commit 钩子，运行 lint-staged 命令，对\*.js 执行 eslint 命令。eslint 要提前配置好。
lint-staged 过滤文件采用 glob 模式。

## \* 测试校验提交信息

```sh
git add .
git commit -m "测试"
```

会发现提交报错，需更改提交信息

```sh
git commit -m "feat: 提交"
```

## \* 使用工具生成符合规范的 commit message

### 1. 安装

首先安装`@commitlint/cz-commitlint`和`commitizen`

```sh
npm install --save-dev @commitlint/cz-commitlint commitizen
```

### 2. 适配器

commitizen 通常要与适配器一起使用，通俗点来说是需要一个 commit message 模板，目前主流的是符合 Angular 规范的 cz-conventional-changelog。

#### 这种方式是使用 npm 来安装 cz-conventional-changelog

```sh
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

#### 这种方式是使用 yarn 来安装

```sh
commitizen init cz-conventional-changelog --yarn --dev --exact
```

> 假如你已经全局安装了适配器，那么上面的命令会报 A previous adapter is already configured. Use --force to override，如它所说，只需要加上 --force 参数即可强制使用局部适配器，成功后会在本地局部安装 cz-conventional-changelog

### 3. package.json 添加 script

```js
{
 "scripts": {
  "commit": "git-cz"
 },
 "config": {
  "commitizen": {
   "path": "@commitlint/cz-commitlint"
  }
 }
}
```

### 4. 命令提交

安装成功后即可通过命令 git-cz 来代替 git commit 进行提交了

### 5. 配置中文

修改 commitlint.config.js

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  prompt: {
    questions: {
      type: {
        description: '选择你要提交的类型:',
        enum: {
          feat: {
            description: '新功能',
            title: 'Features',
            emoji: '✨'
          },
          fix: {
            description: '修复相关bug',
            title: 'Bug Fixes',
            emoji: '🐛'
          },
          docs: {
            description: '文档更改',
            title: 'Documentation',
            emoji: '📚'
          }
        }
      }
    }
  }
}
```
