import './resultGameView.css';
import View from '../../../view';
import {
  ElementParams,
  ElementCreator,
} from '../../../../utils/element-creator';
import EventEmitter from '../../../../utils/EventEmit';

const cssClasses = {
  RESULT: 'game-result-container',
  PARTRESULT: 'game-result-container-part',
  BLOCKPIECE: 'item-piece',
};

export default class ResultGameView extends View {
  constructor() {
    const params: ElementParams = {
      tag: 'div',
      classNames: [cssClasses.RESULT],
      textContent: '',
    };
    super(params);

    this.configureView();
  }

  configureView() {
    const containerParam = {
      tag: 'div',
      classNames: [cssClasses.PARTRESULT],
      textContent: '',
    };
    const containerCreator = new ElementCreator(containerParam);
    this.elementCreator.addInnerElement(containerCreator.getElement());

    const eventEmitter = EventEmitter.getInstance();
    eventEmitter.on('piece', (clickedElement: HTMLElement) => {
      const newElement = document.createElement('div');
      newElement.classList.add(cssClasses.BLOCKPIECE);
      newElement.textContent = clickedElement.textContent;
      containerCreator.getElement().appendChild(newElement);
    });
  }
}
