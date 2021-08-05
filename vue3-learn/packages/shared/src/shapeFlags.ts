
//用于组合，可以实现权限的组合和校验
export const enum ShapeFlags {
  ELEMENT = 1,//元素
  FUNCTION_COMPONENT = 1 << 1,//函数式组件
  STATEFUL_COMPONENT = 1 << 2,//带状态的组件
  TEXT_CHILDREN = 1 << 3,//children是文本
  ARRAY_CHILDREN = 1 << 4,//children是数组
  SLOTS_CHILDREN = 1 << 5,//children是插槽
  TELEPORT = 1 << 6,//传送门
  SUSPENSE = 1 << 7,//实现异步组件等待
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  COMPONENT_KEEP_ALIVE = 1 << 9,
  COMPONENT = ShapeFlags.ELEMENT | ShapeFlags.FUNCTION_COMPONENT
}