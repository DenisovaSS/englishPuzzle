import './containerPieceGameView.css';
import View from '../../../view';
import {
  ElementParams,
  ElementCreator,
} from '../../../../utils/element-creator';
import wordCollectionLevel1 from '../../../../../data/wordCollectionLevel1.json';
import EventEmitter from '../../../../utils/EventEmit';

const wordCollection = wordCollectionLevel1.rounds[0].words[7].textExample;
// console.log(wordCollectionLevel1.rounds[0].words);
const cssClasses = {
  PARTCONTAINER: 'game-container-pieces',
  PARTPIECECONTAINER: 'game-container-part-pieces',
  BLOCKPIECE: 'item-piece',
};

export default class ContainerPieceGameView extends View {
  constructor() {
    const params: ElementParams = {
      tag: 'div',
      classNames: [cssClasses.PARTCONTAINER],
      textContent: '',
    };
    super(params);

    this.configureView();
  }

  configureView() {
    const eventEmitter = EventEmitter.getInstance();
    const sentence = wordCollection;
    const arrayNew = sentence.split(' ');
    const arraysent = this.randomArray(arrayNew);
    const handlePieceClick = (clickedElement: HTMLElement) => {
      const currentElement = this.elementCreator.getElement();
      for (let i = 0; i < currentElement.children.length; i++) {
        const child = currentElement.children[i] as HTMLElement;
        if (child === clickedElement) {
          eventEmitter.emit('piece', clickedElement);
          currentElement.removeChild(child);
          break;
        }
      }
    };
    const createContainerWithClickHandler = (word: string) => {
      eventEmitter.emit('check-disabled');

      const containerParam = {
        tag: 'div',
        classNames: [cssClasses.BLOCKPIECE],
        textContent: word,
      };
      const containerCreator = new ElementCreator(containerParam);
      containerCreator.setEventHandler('click', (event) => {
        const clickedElement = event.target as HTMLElement;
        handlePieceClick(clickedElement);
      });
      this.elementCreator.addInnerElement(containerCreator.getElement());
    };
    arraysent.forEach((word) => {
      createContainerWithClickHandler(word);
    });
    // Function to handle 'pushInPiece' event
    const handlePushInPiece = (clickedElement: HTMLElement) => {
      createContainerWithClickHandler(clickedElement.textContent || '');
    };

    eventEmitter.on('pushInPiece', handlePushInPiece);
  }

  randomArray(array: string[]): string[] {
    const arrayCur = [...array];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arrayCur[i], arrayCur[j]] = [arrayCur[j], arrayCur[i]];
    }

    return arrayCur;
  }
}
