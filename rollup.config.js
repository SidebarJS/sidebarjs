import commonjs from 'rollup-plugin-commonjs';
import npm from 'rollup-plugin-node-resolve';
import * as packageJson from './package.json';

const info = `/*
 * ${packageJson.library}
 * Version ${packageJson.version}
 * ${packageJson.homepage}
 */
`;

export default {
  input: 'src/index.js',
  output: {
    name: 'SidebarJS',
    file: 'dist/sidebarjs.js',
    format: 'umd',
    exports: 'named',
    banner: info,
  },
  plugins: [
    npm({
      main: true,
      jsnext: true,
      browser: true,
    }),
    commonjs(),
  ],
};
