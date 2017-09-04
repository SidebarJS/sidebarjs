import commonjs from 'rollup-plugin-commonjs';
import npm from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.js',
  name: 'SidebarJS',
  output: [{
    file: 'dist/sidebarjs.js',
    format: 'umd',
    exports: 'named',
  }],
  plugins: [
    npm({
      main: true,
      jsnext: true,
      browser: true,
    }),
    commonjs(),
  ],
};
