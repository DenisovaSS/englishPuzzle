import View from '../../../view';
import {
  ElementParams,
  ElementCreator, WordCollection,
} from '../../../../utils/element-creator';
import EventEmitter from '../../../../utils/EventEmit';
// import LevelInfo from '../../../../utils/levelRound';
import { getImgURL } from '../../../../utils/fileLoader';

const cssClasses = {
  PARTCONTAINER: 'game-container-pieces',
  PARTPIECECONTAINER: 'game-container-part-pieces',
  BLOCKPIECE: 'item-piece',
  SPANPIECEBEFORE: 'before',
  SPANPIECEAFTER: 'after',
  DESCRIPTION: 'nameYearAutor',
};
// const gameResultContainer = document.querySelector('.game-result-container');
// console.log(gameResultContainer);
const GAMERESULTCONTAINERWIDTH = 702;
const GAMERESULTCONTAINERHEIGHT = 414;
const MAXLINES = 10;

export default class ContainerPieceGameView extends View {
  private wordCollection: WordCollection;

  private round: number;

  private currentEpisode: number;

  private arrayAnswer: Array<string>;

  private eventEmitter!: EventEmitter;

  private dropInPieceCallback!: (article: HTMLElement) => void;

  private handlePushInPiece!: (clickedElement: HTMLElement) => void;

  private clearPeaceContainer!:()=>void;

  constructor(wordCollection: WordCollection, round: number, currentEpisode: number) {
    const params: ElementParams = {
      tag: 'div',
      classNames: [cssClasses.PARTCONTAINER],
      textContent: '',
    };
    super(params);
    this.wordCollection = wordCollection;
    this.round = round;
    this.currentEpisode = currentEpisode;
    const currentEpisodePart = this.wordCollection.rounds[this.round - 1].words[this.currentEpisode];
    const eventEmitter = EventEmitter.getInstance();
    eventEmitter.emit('setTranslate', currentEpisodePart.textExampleTranslate);
    eventEmitter.emit('setAudio', currentEpisodePart.audioExample);
    console.log(currentEpisodePart.textExample);
    this.arrayAnswer = currentEpisodePart.textExample.split(' ');
    // console.log(this.arrayAnswer);
    this.configureView();
  }

  configureView() {
    const eventEmitter = EventEmitter.getInstance();
    function getUniqueIndices(arr: Array<string>) {
      return arr.map((word, index) => ({ word, index }));
    }
    const uniqueIndices = getUniqueIndices(this.arrayAnswer);
    const shuffledArray = this.randomArray(uniqueIndices);
    const currentElement = this.elementCreator.getElement();
    currentElement.addEventListener('dragover', this.handleDragOver);
    currentElement.addEventListener('drop', (e) => {
      e.preventDefault();
      const article = document.querySelector(`[data-drag-index='${e.dataTransfer?.getData('text')}']`);
      if (article) {
        currentElement.append(article);
      }
    });
    this.dropInPieceCallback = (article: HTMLElement) => {
      // console.log('DropInPiece');
      currentElement.append(article);
    };
    eventEmitter.on('DropInPiece', this.dropInPieceCallback);

    this.clearPeaceContainer = () => {
      // const eventNames = eventEmitter.getAllListeners();
      // console.log(eventNames);
      // console.log(currentElement.children);
      const itemsArray = Array.from(currentElement.children);
      // console.log(itemsArray);
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
    };
    eventEmitter.on('clearPeaceContainer', this.clearPeaceContainer);
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
    const createContainerWithClickHandler = ({ word, index }: { word: string, index: number }) => {
      // eventEmitter.emit('check-disabled');

      const element = this.createPuzzlePiece(word, String(index));
      element.addEventListener('dragstart', this.dragStart);
      element.addEventListener('click', (event) => {
        const clickedElement = event.target as HTMLElement;
        handlePieceClick(clickedElement);
      });
      this.elementCreator.addInnerElement(element);
    };
    shuffledArray.forEach((elem) => {
      createContainerWithClickHandler(elem);
    });
    // Function to handle 'pushInPiece' event
    this.handlePushInPiece = (clickedElement: HTMLElement) => {
      // console.log('send to pieceView');
      const word = clickedElement.textContent || '';
      let index = 0;
      if (clickedElement.dataset.index) { index = +clickedElement.dataset.index; }
      eventEmitter.emit('check-disabled');
      createContainerWithClickHandler({ word, index });
    };

    eventEmitter.on('pushInPiece', this.handlePushInPiece);
  }

  randomArray(array:{
    word: string;
    index: number; }[]) {
    const arrayCur = [...array];
    for (let i = arrayCur.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arrayCur[i], arrayCur[j]] = [arrayCur[j], arrayCur[i]];
    }
    return arrayCur;
  }

  createPuzzlePiece(word:string, originalIndex: string) {
    const backgroundImg = this.wordCollection.rounds[this.round - 1].levelData.imageSrc;
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
        const lineIndex = this.currentEpisode;
        const puzzleIndex = Number(index);
        let backgroundPositionX = -GAMERESULTCONTAINERWIDTH / this.arrayAnswer.length + 2;
        let backgroundPositionY = -9;
        if (puzzleIndex > 0) {
          backgroundPositionX = -(puzzleIndex * (GAMERESULTCONTAINERWIDTH / this.arrayAnswer.length) - backgroundPositionX);
        }
        if (lineIndex > 0) {
          backgroundPositionY = -(lineIndex * (GAMERESULTCONTAINERHEIGHT / MAXLINES) - backgroundPositionY);
        }
        itemAfter.style.backgroundImage = `url(${getImgURL(backgroundImg)})`;
        itemAfter.style.backgroundSize = `${GAMERESULTCONTAINERWIDTH}px ${GAMERESULTCONTAINERHEIGHT}px`;
        itemAfter.style.backgroundPosition = `${backgroundPositionX}px ${backgroundPositionY}px`;
      }

      return spanCreator;
    };
    element.dataset.index = String(originalIndex);
    element.dataset.dragIndex = String(originalIndex) + String(this.round) + String(this.currentEpisode);
    if (+originalIndex === 0) {
      const spanCreator = createSpan(afterParam, element.dataset.index);
      element.append(spanCreator.getElement());
    } else if (+originalIndex === this.arrayAnswer.length - 1) {
      const spanCreator = createSpan(beforeParam, element.dataset.index);
      element.append(spanCreator.getElement());
    } else {
      let spanCreator = createSpan(beforeParam, element.dataset.index);
      element.append(spanCreator.getElement());
      spanCreator = createSpan(afterParam, element.dataset.index);
      element.append(spanCreator.getElement());
    }

    element.draggable = true;
    const lineIndex = this.currentEpisode;
    // console.log(lineIndex);
    let backgroundPositionX = 0;
    let backgroundPositionY = 0;
    const puzzleIndex = Number(element.dataset.index);
    if (puzzleIndex > 0 && GAMERESULTCONTAINERWIDTH) {
      backgroundPositionX = -(puzzleIndex * (GAMERESULTCONTAINERWIDTH / this.arrayAnswer.length));
    }
    if (lineIndex > 0 && GAMERESULTCONTAINERHEIGHT) {
      backgroundPositionY = -(lineIndex * (GAMERESULTCONTAINERHEIGHT / MAXLINES));
    }
    if (GAMERESULTCONTAINERWIDTH) { element.style.width = `${GAMERESULTCONTAINERWIDTH / this.arrayAnswer.length - 40 - 2}px`; }
    element.style.backgroundImage = `url(${getImgURL(backgroundImg)})`;
    element.style.backgroundSize = `${GAMERESULTCONTAINERWIDTH}px ${GAMERESULTCONTAINERHEIGHT}px`;
    element.style.backgroundPosition = `${backgroundPositionX}px ${backgroundPositionY}px`;
    return element;
  }

  handleDragOver(e: Event) {
    e.preventDefault();
  }

  dragStart(event: DragEvent) {
    const target = event.target as HTMLElement;
    if (target && target.dataset.dragIndex) {
      event.dataTransfer?.setData('text', target.dataset.dragIndex);
    } else {
      console.error('Drag target does not have an id');
    }
  }

  unsubscribe() {
    const eventEmitter = EventEmitter.getInstance();
    eventEmitter.unsubscribe('DropInPiece', this.dropInPieceCallback);
    eventEmitter.unsubscribe('pushInPiece', this.handlePushInPiece);
    eventEmitter.unsubscribe('clearPeaceContainer', this.clearPeaceContainer);
  }

  addNameYearAutor() {
    // const currentEpisodePart = this.wordCollection.rounds[this.round - 1].words[this.currentEpisode];
    // eslint-disable-next-line max-len
    const descriptionText = `${this.wordCollection.rounds[this.round - 1].levelData.author} - ${this.wordCollection.rounds[this.round - 1].levelData.name}, ${this.wordCollection.rounds[this.round - 1].levelData.year}`;
    console.log(descriptionText);
    const description = {
      tag: 'div',
      classNames: [cssClasses.DESCRIPTION],
      textContent: descriptionText,
    };
    const descriptionrCreator = new ElementCreator(description);
    this.elementCreator.addInnerElement(descriptionrCreator.getElement());
  }
}
