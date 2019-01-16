import EventEmitter from 'events';
import {Rollup} from './rollup';
import {Typescript} from './typescript';
import {Styles} from './styles';
import yargs from 'yargs';
import fs from 'fs-extra';

const trim = data => typeof data === 'string' ? data.trim() : data.toString().trim();
const eventEmitter = new EventEmitter();
const ts = new Typescript(eventEmitter, trim);
const rollup = new Rollup(eventEmitter, trim);
const styles = new Styles();

fs.emptyDirSync('./lib');

if (yargs.argv.watch) {
  ts.watch(() => rollup.watch());
  styles.watch();
} else {
  ts.compile(() => rollup.compile());
  styles.compile();
}
