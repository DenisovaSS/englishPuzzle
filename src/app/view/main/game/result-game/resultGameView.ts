import './resultGameView.css';
import View from '../../../view';
import {
  ElementParams,
  ElementCreator,
} from '../../../../utils/element-creator';
import EventEmitter from '../../../../utils/EventEmit';
import wordCollectionLevel1 from '../../../../../data/wordCollectionLevel1.json';

const wordCollection = wordCollectionLevel1.rounds[0].words[7].textExample;
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

    const containerCreator = this.configureView();
    this.fillField(containerCreator);
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
    return containerCreator;
  }

  fillField(containerCreator: ElementCreator) {
    const eventEmitter = EventEmitter.getInstance();
    const pieceEventListener = (clickedElement: HTMLElement) => {
      const currentContainerCreator = containerCreator.getElement();
      const newElement = document.createElement('div');
      newElement.classList.add(cssClasses.BLOCKPIECE);
      newElement.textContent = clickedElement.textContent;
      const allChildren = currentContainerCreator.children;
      // console.log(allChildren);
      let childIndex = 0;
      newElement.addEventListener('click', (event) => {
        const clickedPiece = event.target as HTMLElement;
        for (let i = 0; i < allChildren.length; i++) {
          const child = allChildren[i] as HTMLElement;
          if (child.contains(clickedPiece)) {
            eventEmitter.emit('pushInPiece', clickedPiece);
            child.removeChild(clickedPiece);
            break;
          }
        }
      });

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
      if (childIndex === allChildren.length - 1) {
        const finalSrt: string[] = [];
        for (let i = 0; i < allChildren.length; i++) {
          const child = allChildren[i] as HTMLElement;
          if (child.textContent) {
            finalSrt.push(child.textContent);
          }
        }
        // console.log(finalSrt);
        // console.log(finalSrt.join(' ') === wordCollection);
        if (finalSrt.join(' ') === wordCollection) {
          eventEmitter.emit('continue');
        }
      }
    };
    eventEmitter.on('piece', pieceEventListener);
  }
}
