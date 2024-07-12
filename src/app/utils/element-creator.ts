export interface ElementParams {
  tag: string;
  classNames: Array<string>;
  textContent: string;
}
type EventHandler = (event: Event) => void;

export class ElementCreator {
  element: HTMLElement;

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

  setId(id: string) {
    if (this.element) {
      this.element.id = id;
    }
  }

  setStyleElement(typeStyle: string, dataStyle: string) {
    if (typeStyle in this.element.style) {
      const styleProperty = typeStyle as keyof CSSStyleDeclaration;
      // Asserting the type of the value to string
      (this.element.style[styleProperty] as string) = dataStyle;
    } else {
      console.error(`Style property '${typeStyle}' is not valid.`);
    }
  }

  setDisabled(disabled: boolean) {
    if (this.element instanceof HTMLButtonElement) {
      this.element.disabled = disabled;
    } else {
      console.error('only for button elements');
    }
  }

  setEventHandler(eventType: string, eventHandler: EventHandler) {
    this.element.addEventListener(eventType, eventHandler);
  }

  removeEventHandler(eventType: string, eventHandler: EventHandler) {
    this.element.removeEventListener(eventType, eventHandler);
  }
}

export interface WordCollection {
  rounds: {
    levelData: {
      id: string;
      name: string;
      imageSrc: string;
      cutSrc: string;
      author: string;
      year: string;
    };
    words: {
      audioExample: string;
      textExample: string;
      textExampleTranslate: string;
      id: number;
      word: string;
      wordTranslate: string;
    }[];
  }[];
  roundsCount: number;
}
