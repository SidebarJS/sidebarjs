export interface Pointer {
  x: number;
  y: number;
}

export type GestureName = 'start' | 'move' | 'end';

export class Touch {
  public readonly clientX: number;
  public readonly clientY: number;
  public readonly pageX: number;
  public readonly pageY: number;
  public readonly screenX: number;
  public readonly screeny: number;
  public readonly identifier: number;
  constructor(x, y, identifier) {
    this.clientX = x;
    this.clientY = y;
    this.pageX = x;
    this.pageY = y;
    this.screenX = x;
    this.screeny = x;
    this.identifier = identifier;
  }
}

export class Gesture {
  public static createTouchEvent(name: GestureName, x: number, y: number, identifier: number = 0): Event {
    const event: any = document.createEvent('Event');
    event.initEvent('touch' + name, true, true);
    const touch = new Touch(x, y, identifier);
    event.touches = event.targetTouches = [touch];
    event.changedTouches = [touch];
    return event;
  }

  public static dispatchTouchEvent(el: HTMLElement | Document, name: GestureName, x: number, y: number, identifier?: number): void {
    const event = Gesture.createTouchEvent(name, x, y, identifier);
    el.dispatchEvent(event);
  }

  public static swipe(el: HTMLElement | Document, from: Pointer, to: Pointer): void {
    Gesture.dispatchTouchEvent(el, 'start', from.x, from.y);
    let {x, y} = from;
    while (x !== to.x || y !== to.y) {
      x = x < to.x ? ++x : x > to.x ? --x : x;
      y = y < to.y ? ++y : y > to.y ? --y : y;
      Gesture.dispatchTouchEvent(el, 'move', x, y);
    }
    Gesture.dispatchTouchEvent(el, 'end', to.x, to.y);
  }

  public static tap(el: HTMLElement | Document, x: number, y: number): void {
    Gesture.dispatchTouchEvent(el, 'start', 50, 50);
    Gesture.dispatchTouchEvent(el, 'end', 50, 50);
  }
}
