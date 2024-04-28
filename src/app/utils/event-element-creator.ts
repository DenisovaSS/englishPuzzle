export interface ElementParams {
  tag: string;
  classNames: Array<string>;
  textContent: string;
}

type EventHandler = (event: Event) => void;

export class ElementCreator {
  private element: HTMLElement;

  constructor(param: ElementParams) {
    this.element = document.createElement(param.tag);
    this.createElement(param);
  }

  createElement(param: ElementParams) {
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
    cssClasses.forEach((className) => {
      this.element?.classList.add(className);
    });
  }

  setTextContent(text: string) {
    this.element.textContent = text;
  }

  setEventHandler(eventType: string, eventHandler: EventHandler) {
    this.element.addEventListener(eventType, eventHandler);
  }
}
