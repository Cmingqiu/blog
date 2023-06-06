## \* 配置 git message 校验

> 前提：关联了远程仓库

### 1.安装 husky 和 commitlint

```sh
cnpm i husky @commitlint/config-conventional @commitlint/cli -D
```

### 2.husky 初始化

激活开启 husky ，执行完会看到根目录下生成.husky 文件夹 ,里面会保存 husky add 增加的 hook 文件
方式一

```sh
npm set-script prepare "husky install"

然后执行
npm run prepare
```

方式二

```sh
npx husky install
```

::: tip
会在.git/config 中的[core]添加 hooksPath = .husky 表示钩子执行路径
:::

### 3.新增 hooks 钩子

#### 3-1. 新增钩子 commit-msg

用 husky 添加一个 commit-msg hook，代码提交时用来执行 commitlint 命令。  
提交操作执行`git commit -m`会触发 husky`commit-msg`钩子，使用`@commitlint/config-conventiona`校验提交信息。

##### 新建 commitlint 配置文件

新建 commitlint.config.js 配置文件,输入：

```js
module.exports = {
  extends: ['@commitlint/config-conventional']
};
```

##### 新增 hook

```sh
#使用执行 lint-statged 使用本地资源 不下载
npx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"
```

::: warning 注意
这里必须使用双引号才能创建成功
:::

#### 3-2. 新增钩子 pre-commit

再添加一个 pre-commit hook 代码提交前用来执行`lint-staged`命令。  
在 commit 前，我们可以执行测试用例、eslint 校验等，只有这些通过了，才允许提交。这也就是在 pre-commit 这个钩子里需要做的事情。

```sh
npx husky add .husky/pre-commit "npx --no-install lint-staged"
```

**只有执行 git commit 才能触发 pre-commit 钩子；如果配置了 commitizen，使用`npm run commit`，则不会触发该钩子**

##### lint-staged

在代码提交之前，进行代码规则检查能够确保进入 git 库的代码都是符合代码规则的。但是整个项目上运行 lint 速度会很慢，lint-staged 能够让 lint 只**检测暂存区的文件**，所以速度很快。

**Lint-staged 仅仅是文件过滤器，不会帮你格式化任何东西，所以没有代码规则配置文件，需要自己配置一下，如：`.eslintrc`、`.stylelintrc`等，然后在`package.json`中引入。一个仅仅过滤出 Git 代码暂存区文件(被 committed 的文件)的工具**

安装

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
    "*.js": ["eslint --fix", "git add"]
  }
}
// 或者
"lint-staged":{
  "*.{js,ts,vue,jsx,tsx}": ["eslint --fix"],
  "*.{js,jsx,ts,tsx,md,html,css,lees,scss,sass}": "prettier --write",
}
```

会在本地 commit 之前，校验提交的内容是否符合本地配置的 eslint 规则，校验会出现两种结果：

1. 如果符合规则：提交成功
2. 如果不符合规则：自动执行 eslint --fix 尝试自动修复，如果修复成功会提交代码；如果失败，会提示错误，在你修复这个错误之后才能提交代码

::: warning 注意
测试`lint-staged`提交时使用`eslint --fix` 自动修复，如果只是一些空格符，空行的修改，会提交一个空 commit，pre-commit 会阻止提交。可以使用`lint-staged --allow-empty`允许提交空信息
:::

git commit 时触发 pre-commit 钩子，运行 lint-staged 命令，对`*.js` 执行 eslint 命令。eslint 要提前配置好。我们对于 lint-staged 如上文配置，对本次被 commited 中的所有.js 文件，执行 eslint --fix 命令和 git add,命令，前者的的目的是格式化，后者是对格式化之后的代码重新提交。  
lint-staged 过滤文件采用 glob 模式。

除了在 `package.json` 中配置，也可以在`.lintstagedrc`、`lint-staged.config.js` 文件中，lint-staged 的常用选项除了 liners 之外，还有 ignore、concurrent 等，具体参考文档：

```js
{
  "lint-staged": {
    "linters": {
      "src/**/*.{js,scss}": ["some command", "git add"]
    },
    "ignore": ["**/dist/*.min.js"]
  }
}
```

::: warning 注意
window 下执行`husky add`可能会报错，可以分成 2 步，先在.husky 目录下新增`hooks，npx husky add .husky/commit-msg`，然后在文件中写入`npx --no-install commitlint --edit $1`
:::

## \* 测试校验提交信息

```sh
git add .
git commit -m "测试"
```

会发现提交报错，需更改提交信息，**注意冒号后面有空格**

```sh
git commit -m "feat: 提交"
```

## \* 使用工具生成符合规范的 commit message

### 1. 安装

首先安装`@commitlint/cz-commitlint`和`commitizen`

```sh
npm install --save-dev @commitlint/cz-commitlint commitizen
```

### 2. 适配器(暂时忽略)

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
};
```

demo

```js
module.exports = {
  extends: ['@commitlint/config-angular'],
  parserPreset: {
    parserOpts: {
      headerPattern: /^(.*?)(?:\\((.*)\\))?:?\\s(.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject']
    }
  },
  rules: {
    'type-case': [0],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        '📦build',
        '👷ci',
        '📝docs',
        '🌟feat',
        '🐛fix',
        '🚀perf',
        '🌠refactor',
        '🔂revert',
        '💎style',
        '🚨test'
      ]
    ],
    'scope-empty': [2, 'never'],
    'subject-empty': [2, 'never']
  },
  prompt: {
    settings: {},
    skip: ['body', 'footer', 'issues'],
    messages: {
      skip: '回车直接跳过',
      max: '最大%d字符',
      min: '%d chars at least',
      emptyWarning: '内容不能为空，重新输入',
      upperLimitWarning: 'over limit',
      lowerLimitWarning: 'below limit'
    },
    questions: {
      type: {
        description: '请选择提交类型',
        enum: {
          '🌟feat': {
            description: '增加新功能',
            title: 'Features',
            emoji: '🌟'
          },
          '🐛fix': {
            description: '修复bug',
            title: 'Bug Fixes',
            emoji: '🐛'
          },
          '📝docs': {
            description: '修改文档',
            title: 'Documentation',
            emoji: '📝'
          },
          '💎style': {
            description: '样式修改不影响逻辑',
            title: 'Styles',
            emoji: '💎'
          },
          '🌠refactor': {
            description: '功能/代码重构',
            title: 'Code Refactoring',
            emoji: '🌠'
          },
          '🚀perf': {
            description: '性能优化',
            title: 'Performance Improvements',
            emoji: '🚀'
          },
          '🚨test': {
            description: '增删测试',
            title: 'Tests',
            emoji: '🚨'
          },
          '📦build': {
            description: '打包',
            title: '打包',
            emoji: '📦'
          },
          '👷ci': {
            description: 'CI部署',
            title: 'Continuous Integrations',
            emoji: '⚙️'
          },

          '🔂revert': {
            description: '版本回退',
            title: 'Reverts',
            emoji: '🔂'
          }
        }
      },
      scope: {
        description: '请输入修改的范围（必填）'
      },
      subject: {
        description: '请简要描述提交（必填）'
      },
      body: {
        description: '请输入详细描述（可选）'
      },
      isBreaking: {
        description: '有什么突破性的变化吗?'
      },
      breakingBody: {
        description:
          '一个破坏性的变更提交需要一个主体。 请输入提交本身的更长的描述  '
      },
      breaking: {
        description: 'Describe the breaking changes'
      },
      isIssueAffected: {
        description: '是否有未解决的问题?'
      },
      issuesBody: {
        description:
          'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself'
      },
      issues: {
        description: '请输入问题说明'
      }
    }
  }
};
```
