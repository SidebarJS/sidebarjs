import {spawn} from 'child_process';
import signale from 'signale';

export class Typescript {
  static get COMPLETED() {
    return 'typescript:completed';
  }

  constructor(emitter, trim) {
    this.emitter = emitter;
    this.trim = trim;
    debugger;
    this.logger = new signale.Signale({interactive: false, scope: 'typescript'});
  }

  _spawn(params, onCompleteFn) {
    this.logger.await('running...');
    onCompleteFn && this.emitter.on(Typescript.COMPLETED, () => setTimeout(onCompleteFn));
    const process = spawn('tsc', params);
    process.stdout.on('data', data => this.completed(data));
    process.stderr.on('data', data => console.log(new Error(this.trim(data))));
    process.on('close', data => this.completed(data));
  }

  compile(onCompleteFn) {
    this._spawn([], onCompleteFn);
  }

  watch(onCompleteFn) {
    this._spawn(['-w'], onCompleteFn)
  }

  completed(data) {
    const message = this.trim(data);
    const hasDoneCompilation = typeof data === 'number' || message.includes('Watching for file changes');
    if (hasDoneCompilation) {
      this.emitter.emit(Typescript.COMPLETED);
      this.logger.success('done!');
      return;
    }
    this.logger.await(`${this.trim(data)}`);
  };
}
