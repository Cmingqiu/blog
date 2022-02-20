Prettier 是一款代码格式化工具，用于检测代码中的格式问题，比如单行代码长度、tab 长度、空格、逗号表达式等。在功能职责上，ESlint 偏向于把控项目的代码质量，而 Prettier 更偏向于统一项目的编码风格。  
在 ESlint 推出 --fix 参数前，ESLint 并没有自动化格式代码的功能，要对一些格式问题做批量格式化只能用 Prettier 这样的工具。并且，Prettier 在代码风格的检测上比 ESlint 更全面，所以两者通常是结合在一起使用的。

## 安装

```sh
npm i eslint prettier -D
```
