import {spawn} from 'child_process';
import signale from 'signale';

export class Rollup {
  static get COMPLETED() {
    return 'rollup:completed';
  }

  constructor(emitter, trim) {
    this.emitter = emitter;
    this.trim = trim;
    this.logger = new signale.Signale({interactive: false, scope: 'rollup'});
  }

  _spawn(params, onCompleteFn) {
    this.logger.await('running...');
    onCompleteFn && this.emitter.on(Rollup.COMPLETED, () => setTimeout(onCompleteFn));
    const process = spawn('rollup', params);
    process.stdout.on('data', data => this.completed(data));
    process.stderr.on('data', data => this.logger.await(`${this.trim(data)}`));
    process.on('close', data => this.completed(data));
  }

  compile(onCompleteFn) {
    this._spawn(['-c'], onCompleteFn);
  }

  watch(onCompleteFn) {
    this._spawn(['-c', '-w'], onCompleteFn);
  }

  completed(data) {
    if (typeof data === 'number') {
      this.logger.success('done!');
      this.emitter.emit(Rollup.COMPLETED);
      return;
    }
    this.logger.await('running...');
  };
}
