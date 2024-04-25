import { ElementCreator, ElementParams } from './element-creator';

export interface InputParams extends ElementParams {
  inputAttributes: {
    type: string;
    name: string;
    id: string;
    value?: string;
    placeholder?: string;
  };
}
export class InputCreator extends ElementCreator {
  constructor(param: InputParams) {
    super(param);

    if (param.tag === 'input') {
      this.setInputAttributes(param.inputAttributes);
    }
  }

  setInputAttributes(attributes: { [key: string]: string }) {
    const inputElement = this.element as HTMLInputElement;
    Object.keys(attributes).forEach((key) => {
      inputElement.setAttribute(key, attributes[key]);
    });
  }
}
