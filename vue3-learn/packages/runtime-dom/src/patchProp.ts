

/**
 * 比对class 如果next不存在，则置空class
 * @param el
 * @param next
 */
let patchClass = (el, next) => {
  if (next === null || next === undefined) next = '';
  el.className = next;
};


/*  
  1.老的有、新的没有： 移除老的样式
  2.老的没有、新的有：使用新的样式
  3.新老都有：使用新的样式
*/
let patchStyle = (el, prev, next) => {
  if (next === null || next === undefined) return el.removeAttribute('style')
  if (prev) {
    for (let key in prev) {
      if (!next[key]) {
        el.style[key] = ''
      }
    }
  }
  for (let key in next) {
    el.style[key] = next[key]
  }
};


/**处理前后绑定的事件不一样
 * react采用事件代理  vue直接给元素绑定事件
 * @param el 
 * @param key 
 * @param next 
 */
let patchEvents = (el, key, next) => {
  let invokers = el._vei || (el._vei = {}); //有缓存事件的作用
  const eventName = key.toLowerCase().slice(2)
  const exist = invokers[key]
  if (exist && next) {
    if (!next) {
      //移除事件
      el.removeEventListener(eventName, exist);
    } else {
      exist.value = next;//替换事件，但是不用解绑
    }
  } else {
    if (next) {
      //绑定事件
      let invoker = invokers[key] = createInvoker(next)
      el.addEventListener(eventName, invoker)
    } else {
      //移除事件
      el.removeEventListener(eventName, exist);//TODO exist不存在 无法移除之前的事件
      invokers[key] = null
    }
  }
};
function createInvoker (fn) {
  const invoker = (e) => { invoker.value(e) }
  invoker.value = fn
  return invoker;
}


function patchAttrs (el, key, next) {
  if (!next) return el.removeAttribute(key)
  el.setAttribute(key, next)
}



export const patchProp = (el, key, prev, next) => {
  switch (key) {
    case 'class':
      patchClass(el, next);
      break;
    case 'style':
      patchStyle(el, prev, next);
      break;
    default:
      if (/^on[A-Z]/.test(key)) {
        //事件diff
        patchEvents(el, key, next)
      } else {
        //普通属性diff 直接使用setAttribute
        patchAttrs(el, key, next)
      }
      break;
  }
};
