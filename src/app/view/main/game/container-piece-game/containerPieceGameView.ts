import './containerPieceGameView.css';
import View from '../../../view';
import {
  ElementParams,
  ElementCreator,
} from '../../../../utils/element-creator';
import EventEmitter from '../../../../utils/EventEmit';
import LevelInfo from '../../../../utils/levelRound';

const wordCollection = LevelInfo.currentEpisodePart.textExample;
const sentence = wordCollection;
const arrayAnswer = sentence.split(' ');
const cssClasses = {
  PARTCONTAINER: 'game-container-pieces',
  PARTPIECECONTAINER: 'game-container-part-pieces',
  BLOCKPIECE: 'item-piece',
  SPANPIECEBEFORE: 'before',
  SPANPIECEAFTER: 'after',
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
    const wordToIndexMap = new Map();
    arrayAnswer.forEach((word: string, index: number) => {
      wordToIndexMap.set(word, index);
    });
    const shuffledArray = this.randomArray(arrayAnswer);
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
          // currentElement.removeChild(child);
          break;
        }
      }
    };
    const createContainerWithClickHandler = (word: string) => {
      eventEmitter.emit('check-disabled');
      const originalIndex = wordToIndexMap.get(word);
      const element = this.createPuzzlePiece(word, originalIndex);
      element.addEventListener('dragstart', this.dragStart);
      element.addEventListener('click', (event) => {
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

  createPuzzlePiece(word:string, originalIndex: string) {
    const containerParam = {
      tag: 'div',
      classNames: [cssClasses.BLOCKPIECE],
      textContent: word,
    };
    const beforeParam = {
      tag: 'span',
      classNames: [cssClasses.SPANPIECEBEFORE],
      textContent: '',
    };
    const afterParam = {
      tag: 'span',
      classNames: [cssClasses.SPANPIECEAFTER],
      textContent: '',
    };
    const containerCreator = new ElementCreator(containerParam);
    const element = containerCreator.getElement();
    if (+originalIndex === 0) {
      const spanCreator = new ElementCreator(afterParam);
      element.append(spanCreator.getElement());
    } else if (+originalIndex === arrayAnswer.length - 1) {
      const spanCreator = new ElementCreator(beforeParam);
      element.append(spanCreator.getElement());
    } else {
      let spanCreator = new ElementCreator(beforeParam);
      element.append(spanCreator.getElement());
      spanCreator = new ElementCreator(afterParam);
      element.append(spanCreator.getElement());
    }
    element.dataset.index = String(originalIndex);
    element.draggable = true;
    return element;
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
