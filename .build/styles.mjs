import signale from 'signale';
import fs from 'fs-extra';
import sass from 'node-sass';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import Watcher from 'node-sass-watcher';

const stylesEntryFile = `./src/sidebarjs.scss`;
const stylesOutputFile = `./lib/sidebarjs`;

export class Styles {
  constructor() {
    this.logger = new signale.Signale({interactive: false, scope: 'styles'});
  }

  async compile() {
    this.logger.await('running...');
    const compiled = sass.renderSync({file: stylesEntryFile});
    const plugins = [autoprefixer];
    const options = {from: undefined};
    const autoprefixed = await postcss(plugins).process(compiled.css, options);
    const minified = await postcss([...plugins, cssnano({preset: 'default'})]).process(compiled.css, options);
    fs.writeFileSync(`${stylesOutputFile}.css`, autoprefixed.css);
    fs.writeFileSync(`${stylesOutputFile}.min.css`, minified.css);
    this.logger.success('done!');
  }

  watch() {
    const watcher = new Watcher(stylesEntryFile, {verbosity: 1});
    watcher.on('init', () => this.compile());
    watcher.on('update', () => this.compile());
    watcher.run();
  }
}
