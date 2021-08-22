export function initWatch(vm) {
  const watches = vm.$options.watch;
  for (let key in watches) {
    vm.$watch(key, watches[key]);
  }
}
