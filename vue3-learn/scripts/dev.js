const execa = require('execa');

const target = 'runtime-dom';

build(target);
function build(target) {
  return execa('rollup', ['-cw', '--environment', `TARGET:${target}`], {
    stdio: 'inherit'
  });
}
