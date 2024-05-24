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
    const wordArray = sentence.split(' ');
    const wordToIndexMap = new Map();
    wordArray.forEach((word: string, index: number) => {
      wordToIndexMap.set(word, index);
    });
    const shuffledArray = this.randomArray(wordArray);
    const currentElement = this.elementCreator.getElement();
    currentElement.addEventListener('dragover', this.handleDragOver);
    currentElement.addEventListener('drop', (e) => {
      e.preventDefault();
      const article = document.querySelector(`[data-index='${e.dataTransfer?.getData('text')}']`);
      if (article) {
        currentElement.append(article);
      }
    });
    eventEmitter.on('DropInPiece', (article: HTMLElement) => {
      currentElement.append(article);
    });

    eventEmitter.on('clearPeaceContainer', () => {
      while (currentElement.firstElementChild) {
        currentElement.firstElementChild.remove();
      }
    });
    const handlePieceClick = (clickedElement: HTMLElement) => {
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
      const originalIndex = wordToIndexMap.get(word);
      const containerParam = {
        tag: 'div',
        classNames: [cssClasses.BLOCKPIECE],
        textContent: word,
      };
      const containerCreator = new ElementCreator(containerParam);
      const element = containerCreator.getElement();
      element.dataset.index = String(originalIndex);
      element.draggable = true;
      element.addEventListener('dragstart', this.dragStart);
      containerCreator.setEventHandler('click', (event) => {
        const clickedElement = event.target as HTMLElement;
        handlePieceClick(clickedElement);
      });
      this.elementCreator.addInnerElement(element);
    };
    shuffledArray.forEach((word: string) => {
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

  handleDragOver(e: Event) {
    e.preventDefault();
  }

  dragStart(event: DragEvent) {
    const target = event.target as HTMLElement;
    if (target && target.dataset.index) {
      event.dataTransfer?.setData('text', target.dataset.index);
    } else {
      console.error('Drag target does not have an id');
    }
  }
}
