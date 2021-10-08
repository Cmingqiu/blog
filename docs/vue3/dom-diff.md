dom diff 尽可能复用之前的内容，当新老 vnode 一样的时候，就进行 dom diff。
比对新老 vnode，根据新 vnode 新增或删除老 vnode，操作的永远都是老的 vnode
dom diff 操作的都是真实 dom
dom diff 是全量比对，浪费鑫能，所以有 blockTree

vue2 中：老头和新头比较，老尾和新尾比较，交叉比对（老头和新尾比较，老尾和新头比较）
vue3 中：头头比对，尾尾比对，然后乱序比对(最长递增子序列)

vue3 优化的点：(模板编译阶段)

1. blockTree+patchFlag
2. 静态提升 hoistStatic
3. 属性提升
4. 字符串化
5. 事件缓存 cacheHandle
