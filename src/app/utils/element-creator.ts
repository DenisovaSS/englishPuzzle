export interface ElementParams {
  tag: string;
  classNames: Array<string>;
  textContent: string;
}

export class ElementCreator {
  element: HTMLElement;

  constructor(param: ElementParams) {
    this.element = document.createElement('div');
    this.createElement(param);
  }

  createElement(param: ElementParams) {
    this.element = document.createElement(param.tag);
    this.setCssClasses(param.classNames);
    this.setTextContent(param.textContent);
  }

  getElement() {
    return this.element;
  }

  addInnerElement(element: HTMLElement | ElementCreator) {
    if (element instanceof ElementCreator) {
      this.element.append(element.getElement());
    } else {
      this.element.append(element);
    }
  }

  setCssClasses(cssClasses: Array<string>) {
    // eslint-disable-next-line array-callback-return
    cssClasses.map((className) => {
      this.element?.classList.add(className);
    });
  }

  setTextContent(text: string) {
    if (this.element) {
      this.element.textContent = text;
    }
  }
}
