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
    let countChild = 0;
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
            countChild--;
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
        countChild++;
      }
      if (countWordSentanc === countChild) {
        eventEmitter.emit('check');
        const finalSrt: string[] = [];
        for (let i = 0; i < allChildren.length; i++) {
          const child = allChildren[i] as HTMLElement;
          if (child.textContent) {
            finalSrt.push(child.textContent);
          }
        }
        if (finalSrt.join(' ') === wordCollection) {
          for (let i = 0; i < allChildren.length; i++) {
            const child = allChildren[i] as HTMLElement;
            child.style.pointerEvents = 'none';
          }
          eventEmitter.emit('check-remove');
          eventEmitter.emit('continue');
        }
        eventEmitter.on('check-sentences', () => {
          for (let j = 0; j < allChildren.length; j++) {
            const partchild = allChildren[j] as HTMLElement;
            const word = wordCollection.split(' ')[j];
            if (partchild.textContent) {
              if (partchild.textContent !== word) {
                partchild.classList.add('incorrect');
              }
              if (partchild.textContent === word) {
                partchild.classList.remove('incorrect');
              }
            }
          }
        });
      }
    };
    eventEmitter.on('piece', pieceEventListener);
  }
}
