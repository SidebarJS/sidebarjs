import commonjs from 'rollup-plugin-commonjs';
import npm from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/index.js',
  moduleName: 'SidebarJS',
  targets: [
    {
      dest: 'dist/sidebarjs.js',
      format: 'umd',
    },
  ],
  plugins: [
    npm({
      main: true,
      jsnext: true,
      browser: true,
    }),
    commonjs(),
  ],
};
