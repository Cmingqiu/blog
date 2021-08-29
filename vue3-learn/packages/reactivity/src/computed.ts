import { isObject } from '@vue/shared';
import { effect, track, trigger } from './effect';

/**
 * 1.默认不执行computed，只有取值的时候执行
 * 2.computed内部使用lazy为true的effect
 * 3.缓存结果，多次取computed的值从缓存中取
 * 4.当依赖属性发生改变，执行computed的effect的schedular;当取值的时候再次执行computed的fn
 * 5.属性改变 --> 触发computed effect更新 --> 触发渲染effect更新
 */

export function computed(getOrOptions) {
  let get, set;
  if (isObject(getOrOptions)) {
    get = getOrOptions.get;
    set = getOrOptions.set;
  } else {
    get = getOrOptions;
  }

  return new ComputedRefImpl(get, get);
}

class ComputedRefImpl {
  public effect;
  public _value;
  public _dirty = true; // 默认是脏值
  public readonly _v_isRef = true;
  constructor(public get, public set) {
    this.effect = effect(get, {
      lazy: true,
      scheduler: () => {
        //依赖的属性发生改变，会触发schedular执行
        if (!this._dirty) {
          this._dirty = true;
          trigger(this, 'edit', 'value');
        }
      }
    });
  }
  get value() {
    if (this._dirty) {
      //缓存
      this._value = this.effect();
      this._dirty = false;
    }
    track(this, 'get', 'value');
    return this._value;
  }
  set value(newValue) {
    this.set(newValue);
  }
}
