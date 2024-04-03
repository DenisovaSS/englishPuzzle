export interface ElementParams {
  tag: string;
  classNames: Array<string>;
  parent?: HTMLElement | null;
  textContent: string;
  callback: (event: MouseEvent) => void;
}
export class ElementCreator {
  element: HTMLElement | null;

  constructor(param: ElementParams) {
    this.element = null;
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

  setCssClasses(cssClasses: Array<string>) {
    // eslint-disable-next-line array-callback-return
    cssClasses.map((className) => {
      if (this.element) {
        this.element.classList.add(className);
      }
    });
  }

  setTextContent(text: string) {
    if (this.element) {
      this.element.textContent = text;
    }
  }

  setCallback(callback: (event: Event) => void) {
    if (typeof callback === 'function') {
      if (this.element) {
        this.element.addEventListener('click', (event) => callback(event));
      }
    }
  }
}
