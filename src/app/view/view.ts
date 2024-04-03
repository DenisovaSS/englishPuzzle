/* eslint-disable @typescript-eslint/comma-dangle */
import { ElementCreator, ElementParams } from '../utils/element-creator';

export default class View {
  elementCreator: ElementCreator;

  constructor(params: ElementParams) {
    this.elementCreator = this.createView(params);
  }

  getHtmlElement() {
    return this.elementCreator.getElement();
  }

  createView(params: ElementParams): ElementCreator {
    const elementParams = {
      tag: params.tag,
      classNames: params.classNames,
      textContent: params.textContent,
      callback: params.callback
    };
    const elementCreator = new ElementCreator(elementParams);
    return elementCreator;
  }
}
