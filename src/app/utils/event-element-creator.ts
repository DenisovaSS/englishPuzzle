import { ElementCreator, ElementParams } from './element-creator';

export default class EventElementCreator extends ElementCreator {
  callback: (event: MouseEvent | KeyboardEvent) => void;

  constructor(
    param: ElementParams,
    // eslint-disable-next-line @typescript-eslint/comma-dangle
    callback: (event: MouseEvent | KeyboardEvent) => void
  ) {
    super(param);
    this.callback = callback;
    this.setCallback();
  }

  setCallback() {
    this.element.addEventListener('click', this.callback);
  }
}
