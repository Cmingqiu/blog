## line-clamp

-webkit-line-clamp CSS 属性 可以把 块容器 中的内容限制为指定的行数。它只有在 display 属性设置成 -webkit-box 或者 -webkit-inline-box 并且 -webkit-box-orient (en-US) 属性设置成 vertical 时才有效果。在大部分情况下,也需要设置 overflow 属性为 hidden, 否则,里面的内容不会被裁减,并且在内容显示为指定行数后还会显示省略号(ellipsis )。

```css
/* Keyword value  none: 这个值表明内容显示不会被限制 */
-webkit-line-clamp: none;

/* <integer> values : integer 这个值表明内容显示了多少行之后会被限制.必须大于0.*/
-webkit-line-clamp: 3;
-webkit-line-clamp: 10;

/* Global values */
-webkit-line-clamp: inherit;
-webkit-line-clamp: initial;
-webkit-line-clamp: unset;
```

## box-orient

规定框的子元素应该被水平或垂直排列。
提示：水平框中的子元素从左向右进行显示，而垂直框的子元素从上向下进行显示。不过，box-direction 和 box-ordinal-group 能够改变这种顺序。

|     值     | 描述                                   |
| :--------: | -------------------------------------- |
| horizontal | 在水平行中从左向右排列子元素。         |
|  vertical  | 从上向下垂直排列子元素。               |
|  inherit   | 应该从父元素继承 box-orient 属性的值。 |

:::warning
浏览器支持
目前没有浏览器支持 box-orient 属性。Firefox 支持替代的 -moz-box-orient 属性。Safari、Opera 以及 Chrome 支持替代的 -webkit-box-orient 属性。
:::

实现

```html
<p>
  In this example the <code>-webkit-line-clamp</code> property is set to
  <code>3</code>, which means the text is clamped after three lines. An ellipsis
  will be shown at the point where the text is clamped.
</p>
```

```css
p {
  width: 300px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}
```

:::tip 温馨提示
vue 插件 轻松实现多行文本截断。 [vue-clamp](https://justineo.github.io/vue-clamp/demo/?lang=zh&fileGuid=XtpJhGpvWxj6qcTr)
:::
