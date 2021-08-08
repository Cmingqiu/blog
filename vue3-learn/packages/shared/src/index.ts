export { ShapeFlags } from './shapeFlags';

export const hasChanged = (newValue, oldValue) => newValue !== oldValue;

export const isObject = obj => typeof obj === 'object' && obj !== null;

export const isFunction = fn => typeof fn === 'function';

export const isArray = Array.isArray;

export const isString = str => typeof str === 'string';

export const isIntegerKey = key => '' + parseInt(key) === key;

export const isVnode = value => (value ? value.__v_isVnode : false);

//判断是否是相同元素
export const isSameVnode = (n1, n2) => n1.type === n2.type && n1.key === n2.key;

export const extend = Object.assign;

export const hasOwn = (target, key) =>
  Object.prototype.hasOwnProperty.call(target, key);
