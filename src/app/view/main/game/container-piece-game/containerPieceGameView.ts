import View from '../../../view';
import {
  ElementParams,
  ElementCreator,
} from '../../../../utils/element-creator';
import EventEmitter from '../../../../utils/EventEmit';
import LevelInfo from '../../../../utils/levelRound';
import { getImgURL } from '../../../../utils/fileLoader';

const wordCollection = LevelInfo.currentEpisodePart.textExample;
const roundWordCollection = LevelInfo.wordCollection.rounds[LevelInfo.currentRound - 1].levelData;
const sentence = wordCollection;
const arrayAnswer = sentence.split(' ');
const cssClasses = {
  PARTCONTAINER: 'game-container-pieces',
  PARTPIECECONTAINER: 'game-container-part-pieces',
  BLOCKPIECE: 'item-piece',
  SPANPIECEBEFORE: 'before',
  SPANPIECEAFTER: 'after',
};
// const gameResultContainer = document.querySelector('.game-result-container');
// console.log(gameResultContainer);
const containerW = 702;
const containerH = 400;

const maxLines = 10;

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
      // console.log(currentElement.children);
      const itemsArray = Array.from(currentElement.children);
      if (itemsArray) {
        itemsArray.sort((a, b) => {
          const indexA = parseInt(a.getAttribute('data-index') || '0', 10);
          const indexB = parseInt(b.getAttribute('data-index') || '0', 10);
          return indexA - indexB;
        });
      }
      while (currentElement.firstElementChild) {
        currentElement.firstElementChild.remove();
      }
      itemsArray.forEach((item) => {
        eventEmitter.emit('piece', item);
      });
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
    const createSpan = (param:ElementParams, index:string): ElementCreator => {
      let spanCreator = new ElementCreator(param);
      if (param === afterParam) {
        spanCreator = new ElementCreator(param);
        const itemAfter = spanCreator.getElement();
        const lineIndex = LevelInfo.currentEpisode;
        const puzzleIndex = Number(index);
        let backgroundPositionX = -containerW / arrayAnswer.length + 2;
        let backgroundPositionY = -9;
        if (puzzleIndex > 0) {
          backgroundPositionX = -(puzzleIndex * (containerW / arrayAnswer.length) - backgroundPositionX);
        }
        if (lineIndex > 0) {
          backgroundPositionY = -(lineIndex * (containerH / maxLines) - backgroundPositionY);
        }
        itemAfter.style.backgroundImage = `url(${getImgURL(roundWordCollection.imageSrc)})`;
        itemAfter.style.backgroundSize = `${containerW}px ${containerH}px`;
        itemAfter.style.backgroundPosition = `${backgroundPositionX}px ${backgroundPositionY}px`;
      }

      return spanCreator;
    };
    element.dataset.index = String(originalIndex);
    if (+originalIndex === 0) {
      const spanCreator = createSpan(afterParam, element.dataset.index);
      element.append(spanCreator.getElement());
    } else if (+originalIndex === arrayAnswer.length - 1) {
      const spanCreator = createSpan(beforeParam, element.dataset.index);
      element.append(spanCreator.getElement());
    } else {
      let spanCreator = createSpan(beforeParam, element.dataset.index);
      element.append(spanCreator.getElement());
      spanCreator = createSpan(afterParam, element.dataset.index);
      element.append(spanCreator.getElement());
    }

    element.draggable = true;
    const lineIndex = LevelInfo.currentEpisode;
    let backgroundPositionX = 0;
    let backgroundPositionY = 0;
    const puzzleIndex = Number(element.dataset.index);
    if (puzzleIndex > 0 && containerW) {
      backgroundPositionX = -(puzzleIndex * (containerW / arrayAnswer.length));
    }
    if (lineIndex > 0 && containerH) {
      backgroundPositionY = -(lineIndex * (containerH / maxLines));
    }
    if (containerW) { element.style.width = `${containerW / arrayAnswer.length - 40 - 2}px`; }
    element.style.backgroundImage = `url(${getImgURL(roundWordCollection.imageSrc)})`;
    element.style.backgroundSize = `${containerW}px ${containerH}px`;
    element.style.backgroundPosition = `${backgroundPositionX}px ${backgroundPositionY}px`;
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
