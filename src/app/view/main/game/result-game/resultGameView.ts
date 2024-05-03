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
  PARTPIECE: 'game-result-container-part-piece',
  BLOCKPIECE: 'item-piece',
};
const countWordSentanc: number = 9;
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
    const containerPieceParam = {
      tag: 'div',
      classNames: [cssClasses.PARTPIECE],
      textContent: '',
    };
    for (let i = 0; i < countWordSentanc; i++) {
      const containerPieceCreator = new ElementCreator(containerPieceParam);
      // containerPieceCreator.setId(String(i));
      containerCreator.addInnerElement(containerPieceCreator.getElement());
    }

    const eventEmitter = EventEmitter.getInstance();
    eventEmitter.on('piece', (clickedElement: HTMLElement) => {
      const currentContainerCreator = containerCreator.getElement();
      // console.log(currentContainerCreator.firstChild?.hasChildNodes());
      const newElement = document.createElement('div');
      newElement.classList.add(cssClasses.BLOCKPIECE);
      newElement.textContent = clickedElement.textContent;
      const allChildren = currentContainerCreator.children;
      let childIndex = 0;
      while (
        // eslint-disable-next-line operator-linebreak
        childIndex < allChildren.length &&
        allChildren[childIndex].childElementCount > 0
      ) {
        childIndex++;
      }
      if (childIndex < allChildren.length) {
        allChildren[childIndex].append(newElement);
      }
    });
  }
}
