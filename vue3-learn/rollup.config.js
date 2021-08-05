import ts from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import path from 'path';
// import fs from 'fs';

const resolve = filepath => path.resolve(__dirname, filepath);

const target = process.env.TARGET;

const packageDir = resolve(`packages/${target}`); //当前包的路径
const resolveBase = filepath => path.resolve(packageDir, filepath);
const packageJSON = require(resolveBase('package.json'));
const { name, formats } = packageJSON.buildOptions;

const outputConfig = {
  cjs: {
    file: resolveBase(`dist/${target}.cjs.js`),
    format: 'cjs'
  },
  'esm-bundler': {
    file: resolveBase(`dist/${target}.esm-bundle.js`),
    format: 'es'
  },
  global: {
    file: resolveBase(`dist/${target}.global.js`),
    format: 'iife'
  }
};

function createConfig(output) {
  output.name = name || '';
  console.log(name);
  output.sourcemap = true;
  return {
    input: resolveBase('src/index.ts'),
    output,
    plugins: [
      nodeResolve({
        extensions: ['.js', 'ts', 'json']
      }),
      ts({
        tsconfig: resolve('tsconfig.json')
      }),
      json()
    ]
  };
}

const targetOption = formats.map(format => createConfig(outputConfig[format]));
// console.log(fs.readFileSync(`./packages/reactivity/package.json`, 'utf-8'));

export default targetOption;
