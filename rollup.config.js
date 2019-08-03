import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import {terser} from 'rollup-plugin-terser';
import * as packageJson from './package.json';

const info = `/*
 * ${packageJson.library}
 * Version ${packageJson.version}
 * ${packageJson.homepage}
 */
`;

const config = (options = {}) => ({
  input: 'lib/src/index.js',
  output: options.output.map(type => ({
    name: 'SidebarJS',
    file: `lib/${type}/sidebarjs${options.minify ? '.min' : ''}.js`,
    format: type,
    exports: 'named',
    banner: info,
  })),
  plugins: [...(options.plugins || []), options.minify ? terser() : false].filter(Boolean),
});

const plugins = [
  resolve({mainFields: ['module', 'main'], browser: true}),
  babel({exclude: 'node_modules/**'}),
  commonjs(),
];

export default [
  config({output: ['umd', 'amd', 'cjs'], plugins}),
  config({output: ['umd', 'amd', 'cjs'], plugins, minify: true}),
  config({output: ['esm']}),
];
