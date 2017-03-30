import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import npm from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/sidebarjs.js',
  moduleName: 'SidebarJS',
  targets: [
    {
      dest: 'dist/sidebarjs.js',
      format: 'umd',
    },
  ],
  plugins: [
    babel({exclude: 'node_modules/**'}),
    npm({
      main: true,
      jsnext: true,
      browser: true,
    }),
    commonjs(),
  ],
};
