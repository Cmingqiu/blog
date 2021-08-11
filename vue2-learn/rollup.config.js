import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
import nodeResolve from '@rollup/plugin-node-resolve';

export default {
  input: './src/index.js',
  output: {
    file: './dist/bundle.js', //'dist/bundle.js'
    format: 'umd',
    name: 'Vue',
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: '/node_modules/**' //忽略node_module下的所有文件
    }),
    nodeResolve(),
    process.env.NODE_ENV === 'development'
      ? serve({
          open: true,
          port: 3000, //默认：10001
          contentBase: '',
          openPage: '/public/index.html' //必须绝对路径
        })
      : null
  ]
};
