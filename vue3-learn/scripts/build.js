const fs = require('fs');

const execa = require('execa');

const targets = fs
  .readdirSync('packages')
  .filter(p => fs.statSync(`packages/${p}`).isDirectory());
//[ 'reactivity', 'shared' ]

//并行打包
runParallel(targets, build).then(res => {
  console.log('打包成功');
});

function runParallel(targets, iteratorFn) {
  let result = [];
  for (let target of targets) {
    result.push(iteratorFn(target));
  }

  return Promise.all(result);
}

function build(target) {
  return execa('rollup', ['-c', '--environment', `TARGET:${target}`], {
    stdio: 'inherit'
  });
}
