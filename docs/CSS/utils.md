## 使用 :not() 来精简 css 代码

```css
// 不使用:not()
.nav li {
  border-right: 1px solid #666;
}
.nav li:last-child {
  border-right: none;
}

// 使用:not()
.nav li:not(:last-child) {
  border-right: 1px solid #666;
}

// 或者使用兄弟选择符~
.nav li:first-child ~ li {
  border-left: 1px solid #666;
}
```
