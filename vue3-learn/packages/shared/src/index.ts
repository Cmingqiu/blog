export { ShapeFlags } from "./shapeFlags"

export const hasChanged = (newValue, oldValue) => newValue !== oldValue

export const isObject = obj => typeof obj === 'object' && obj !== null

export const extend = Object.assign

export const isArray = Array.isArray

export const isIntegerKey = key => '' + parseInt(key) === key


export const hasOwn = (target, key) => Object.prototype.hasOwnProperty.call(target, key)

export const isString = str => typeof str === 'string'