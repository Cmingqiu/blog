先看是否有 render，没有就找 template，最后没有就找 el 的 outerHTML 作为模板，调用 compileToFunction 进行编译。compileToFunction 中有 3 步，即模板编译阶段总共分为 3 步：

1. 利用正则进行词法解析，将模板转成 ast 抽象语法树（parseHtml）
2. 遍历 ast，标记静态节点，优化阶段
3. 将 ast 转成 render 函数（generate）

```js
import { generate } from './generate';
import { parserHTML } from './parser';

export function compileToFunction(html) {
  // 编译流程有三个部分 1.把模板变成ast语法树   2.优化标记静态节点 （patchFlag,BlockTree） 3.把ast变成render函数
  const ast = parserHTML(html);
  // 2.优化标记静态节点
  // 3.将ast变成render函数  你要把刚才这棵树 用字符串拼接的方式 变成render函数
  const code = generate(ast); // 根据ast生成一个代码字符串
  const render = new Function(`with(this){return ${code}}`);
  return render;
}

// 第一种 一个个的进行词法解析 <  {  （状态机 随着状态的扭转把结果进行解析） Vue3
// 第二种 采用的是正则
// <div id="app">hello{{age}}</div>
```

## 模板转 ast

利用正则解析字符串模板，解析多少截取多少，直到所有模板解析完成。遇到开始标签，结束标签和文本会向外抛出结果，用栈结构构造父子关系，生成树结构，即 ast 抽象语法树。

```js
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; //
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //  match匹配的是标签名
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的 分组里放的就是 "b",'b' ,b  => (b) 3 | 4 | 5

// a = "b"   a = 'b'   a = b
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 <br/>   <div>
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{  asdasd  }}

export function parserHTML(html) {
  function advance(len) {
    html = html.substring(len);
  }

  function parseStartTag() {
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      };
      advance(start[0].length);
      let attr;
      let end;
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        });
        advance(attr[0].length);
      }
      advance(end[0].length);
      return match;
    }
    return false;
  }
  // 生成一颗树  <div id="app" a=1 b=2>hello{{age}} <span>{{name}}</p>111</div>
  // [div,span]
  // 文本 -》 我的父亲是div
  // span => 我的父亲是div
  // {{name}} => 我的父亲是span
  // 遇到结束标签 就做pop操作 [div]
  // 111 -> 我的父亲是div
  //  就做pop操作
  let root = null;
  let stack = [];
  let parent = null;
  function createAstElement(tag, attrs) {
    return {
      tag,
      type: 1,
      attrs,
      children: [],
      parent: null
    };
  }
  function start(tagName, attrs) {
    // 匹配到了开始的标签
    let element = createAstElement(tagName, attrs);
    if (!root) {
      root = element;
    }
    let parent = stack[stack.length - 1];
    if (parent) {
      element.parent = parent; // 当放入span的时候 我就知道div是他的父亲
      parent.children.push(element);
    }
    stack.push(element);
  }
  function chars(text) {
    // 匹配到了开始的标签
    let parent = stack[stack.length - 1];
    text = text.replace(/\s/g, ''); // 遇到空格就删除掉
    if (text) {
      parent.children.push({
        text,
        type: 3
      });
    }
  }
  function end(tagName) {
    stack.pop(); // 每次出去就在栈中删除当前这一项, 这里你可以判断标签是否出错
  }
  while (html) {
    // html只能由一个根节点
    let textEnd = html.indexOf('<');
    if (textEnd == 0) {
      // 如果遇到< 说明可能是开始标签或者结束标签 <!DOC
      const startTagMatch = parseStartTag();
      // console.log(startTagMatch)
      if (startTagMatch) {
        // 匹配到了开始标签
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }
      // 如果代码走到这里了 说明是结束标签
      const endTagMatch = html.match(endTag);
      if (endTagMatch) {
        end(endTagMatch[1]);
        advance(endTagMatch[0].length);
      }
    }
    let text;
    if (textEnd > 0) {
      text = html.substring(0, textEnd);
    }
    if (text) {
      chars(text);
      advance(text.length);
    }
  }
  return root;
}

// 虚拟dom是描述dom的对象
{
  /*  <span>{{name}}</span></div> */
}
// ast 抽象语法树 ，描述html语法本身的
// {
//     tag:'div',
//     type:1,
//     children:[{text:'hello {{age}}',type:3,parent:'div对象'},{ type:'span',type:1,attrs:[],parent:'div对象'}]
//     attrs:[{name:'id':value:'app'}],
//     parent:null
// }
```

## 遍历 ast 语法树

## ast 转 render 函数

拿到 ast 语法树，进行字符串拼接，使用 new Function + with 语法构造了 render 函数。使用 with 是为了方便从 vm 上取值，这里走了数据劫持中的 get，收集依赖。

```js
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{  asdasd  }}

function genProps(attrs) {
  let str = '';
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    if (attr.name === 'style') {
      let style = {}; // color:red;background:blue
      attr.value.replace(/([^;:]+)\:([^;:]+)/g, function() {
        style[arguments[1]] = arguments[2];
      }); // 如果是sytle 我要将style转换成一个对象
      attr.value = style;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  return `{${str.slice(0, -1)}}`;
}

function gen(el) {
  if (el.type == 1) {
    return generate(el);
  } else {
    let text = el.text;
    if (!defaultTagRE.test(text)) {
      return `_v("${text}")`;
    } else {
      let tokens = []; // 珠峰 {{age}} 珠峰
      // _v(_s(name) + '珠峰' + _s(age))
      let match;
      let lastIndex = (defaultTagRE.lastIndex = 0); // 保证每次正则都是从0 开始匹配的
      while ((match = defaultTagRE.exec(text))) {
        // 如果exec + 全局匹配每次执行的时候 都需要还原lastIndex
        let index = match.index; // 匹配到后将前面一段放到tokens中
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }
        tokens.push(`_s(${match[1].trim()})`); // 把当前这一段放到tokens中
        lastIndex = index + match[0].length;
      }
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }
      return `_v(${tokens.join('+')})`;
    }
  }
}

function genChildren(ast) {
  let children = ast.children; // _c('div',{},'xxx')  _c('div',{},[])
  if (children && children.length > 0) {
    return children.map(child => gen(child)).join(',');
  }
  return false;
}
export function generate(ast) {
  let children = genChildren(ast);
  let code = `_c("${ast.tag}",${
    ast.attrs.length ? genProps(ast.attrs) : 'undefined'
  }${children ? ',[' + children + ']' : ''})`;
  return code;
}

// _c('div', {
//     "id": "app",
//     "a": "1",
//     "b": "2",
// }, [_v("hello" + _s(age) + "\n        "), _c('span', [_v(_s(name))])])
```
