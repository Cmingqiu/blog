## EditorConfig

[EditorConfig](https://editorconfig.org/) 是个啥玩意？ 它可以对多种类型的单文件进行简单的格式化，它提供的配置参数很少：

```
# 告诉 EditorConfig 插件，这是根文件，不用继续往上查找
root = true

# 匹配全部文件
[*]

# 设置字符集
charset = utf-8

# 缩进风格，可选 space、tab
indent_style = tab

# 缩进的空格数，当 indent_style = tab 将使用 tab_width
# 否则使用 indent_size
indent_size = 2
tab_width = 2

# 结尾换行符，可选 lf、cr、crlf
end_of_line = lf

# 在文件结尾插入新行
insert_final_newline = true

# 删除一行中的前后空格
trim_trailing_whitespace = true

# 匹配md结尾的文件
[*.md]
insert_final_newline = false
trim_trailing_whitespace = false

```

虽然它提供的格式化的配置参数很少，就 3 个，缩进风格、是否在文件末尾插入新行和是否删除一行中前后空格。但是它还是非常有必要存在的，理由有 3 个：

- 能够在不同的编辑器和 IDE 中保持一致的代码风格；
- 配合插件打开文件即自动格式化，非常方便
- 支持格式化的文件类型很多；

如果需要让以上的配置生效，还得在 VSCode 里安装 EditorConfig for VS Code 这个插件配合使用。

**重点来了**  
可以看到 EditorConfig 和 Prettier 会存在一些重复的配置，比如都提供了对缩进的配置参数，所以在实际使用的时候需要避免它们，或者把他们的参数设置为一致。
