import './resultGameView.css';
import View from '../../../view';
import {
  ElementParams,
  ElementCreator, WordCollection,
} from '../../../../utils/element-creator';
import EventEmitter from '../../../../utils/EventEmit';
import LevelInfo from '../../../../utils/levelRound';
import { getImgURL } from '../../../../utils/fileLoader';
import ContainerPieceGameView from '../container-piece-game/containerPieceGameView';

const cssClasses = {
  RESULTWRAPPER: 'game-wrapper',
  RESULT: 'game-result-container',
  PARTRESULT: 'game-result-container-part',
  PARTPIECE: 'game-result-container-part-piece',
  BLOCKPIECE: 'item-piece',
  SPANPIECEBEFORE: 'before',
  SPANPIECEAFTER: 'after',
};
const MAXLINES = 10;
// const countWordSentence: number = arrayAnswer.length;
export default class ResultGameView extends View {
  private wordCollection: WordCollection;

  private round: number;

  private countWordSentence: number = 0;

  private customerAnswers: number[][];

  private textSentances: string = '';

  private currentEpisode: number = LevelInfo.currentEpisode;

  private gameResultContainer!: ElementCreator;

  private peaceContainer!: ContainerPieceGameView;

  private setNextEpisodeHandler: (nextEpisode: number) => void;

  private pieceEventListener!: (clickedElement: HTMLElement) => void;

  private highlightIncorrectWords!: ()=>void;

  private autoCompleteSentence!: ()=>void;

  private sendInfo!:()=>void;

  private statisticSetInfo!:()=>void;

  constructor(wordCollection: WordCollection, round: number) {
    const params: ElementParams = {
      tag: 'div',
      classNames: [cssClasses.RESULTWRAPPER],
      textContent: '',
    };
    super(params);
    this.wordCollection = wordCollection;
    this.round = round;
    this.gameResultContainer = this.createResultContainer();
    this.customerAnswers = [[], []];
    // this.currentEpisode = LevelInfo.currentEpisode;
    this.initialize(this.currentEpisode);
    const containerCreator = this.configureView(this.gameResultContainer);
    this.fillField(containerCreator);
    this.setNextEpisodeHandler = this.createSetNextEpisodeHandler();
    const eventEmitter = EventEmitter.getInstance();
    eventEmitter.on('setNextEpisode', this.setNextEpisodeHandler);
  }

  createSetNextEpisodeHandler() {
    return (nextEpisode: number) => {
      // this.customerAnswers[0].push(nextEpisode);
      // this.customerAnswers[1].push(nextEpisode + 1);
      // console.log(this.customerAnswers, 'this episode');
      const countCurentEpisode = this.gameResultContainer.getElement().childElementCount;
      if (countCurentEpisode === MAXLINES) {
        this.nextRound();
      } else {
        this.unsubscribe();
        this.currentEpisode = nextEpisode;
        this.initialize(nextEpisode);
        const containerCreator = this.configureView(this.gameResultContainer);
        this.fillField(containerCreator);
      }
    };
  }

  createResultContainer() {
    const resultContainer = this.containerDivCreator(cssClasses.RESULT);
    this.elementCreator.addInnerElement(resultContainer.getElement());
    return resultContainer;
  }

  initialize(currentEpisode:number) {
    const currentEpisodePart = this.wordCollection.rounds[this.round - 1].words[currentEpisode];
    this.textSentances = currentEpisodePart.textExample;
    this.countWordSentence = this.textSentances.split(' ').length;
    if (this.peaceContainer) {
      this.peaceContainer.unsubscribe();
      this.peaceContainer.getHtmlElement().remove();
    }
    this.peaceContainer = new ContainerPieceGameView(this.wordCollection, this.round, currentEpisode);
    this.elementCreator.addInnerElement(this.peaceContainer.getHtmlElement());
  }

  configureView(resultContainer: ElementCreator) {
    const containerCreator = this.containerDivCreator(cssClasses.PARTRESULT);
    // const gameResultContainer = resultContainer.getElement();
    // const roundWordCollection = this.wordCollection.rounds[this.round - 1].levelData;
    // gameResultContainer.style.backgroundImage = `url(${getImgURL(roundWordCollection.imageSrc)})`;
    resultContainer.addInnerElement(containerCreator.getElement());
    for (let i = 0; i < this.countWordSentence; i++) {
      const containerPieceCreator = this.containerDivCreator(cssClasses.PARTPIECE);
      const currentPieceCreator = containerPieceCreator.getElement();
      // baclog: todo size width more dinymic
      currentPieceCreator.style.width = `${902 / this.countWordSentence}px`;
      currentPieceCreator.addEventListener('dragover', this.handleDragOver);
      // currentPieceCreator.addEventListener('dragleave', this.handleDragLeave);
      currentPieceCreator.addEventListener('drop', this.handleDragDrop.bind(this));
      // containerPieceCreator.setId(String(i));
      containerCreator.addInnerElement(currentPieceCreator);
    }
    return containerCreator;
  }

  containerDivCreator(classNames: string) {
    const containerParam = {
      tag: 'div',
      classNames: [classNames],
      textContent: '',
    };
    return new ElementCreator(containerParam);
  }

  handleDragOver(e: Event) {
    // const target = e.target as HTMLElement;
    e.preventDefault();
    // target.style.backgroundColor = 'red';
  }

  handleDragDrop(e: DragEvent) {
    const eventEmitter = EventEmitter.getInstance();
    const target = e.target as HTMLElement;
    const currentTarget = e.currentTarget as HTMLElement;

    const article = document.querySelector(`[data-drag-index='${e.dataTransfer?.getData('text')}']`);

    if (article) {
      // backlog to fix problem with event listener
      const IsOldArticleParentPARTPIECE = article.parentElement?.classList.contains((cssClasses.PARTPIECE));
      if (!IsOldArticleParentPARTPIECE) {
        article.addEventListener('click', (event) => this.handlePieceClick(event));
      }
      if (target.classList.contains(cssClasses.PARTPIECE)) {
        target.appendChild(article);
      } else if (target.classList.contains(cssClasses.BLOCKPIECE)) {
        const oldParent = article.parentElement;
        target.parentElement?.appendChild(article);
        oldParent?.appendChild(target);
      } else {
        eventEmitter.emit('DropInPiece', article);
        // const eventNames = eventEmitter.getAllListeners();
        // console.log(eventNames);
      }
    }
    // ВСЕ элементы game-result-container-part
    const container = currentTarget.parentElement?.children;
    if (container) {
      // eslint-disable-next-line max-len
      // countAllchildrenCurent это длинна масива у которого элемент из game-result-container-part это  в каЖдом не пустом child(те также чем-то заполнен)
      const countAllchildrenCurent = Array.from(container).filter((child) => (child as HTMLElement).childElementCount > 0).length;
      // console.log(countAllchildrenCurent, this.countWordSentence);
      if (countAllchildrenCurent === this.countWordSentence) {
        this.checkSentence(container, eventEmitter);
      }
    }
  }

  fillField(containerCreator: ElementCreator) {
    const eventEmitter = EventEmitter.getInstance();

    const currentContainerCreator = containerCreator.getElement();
    const allChildren = currentContainerCreator.children;
    this.autoCompleteSentence = () => {
      this.customerAnswers[1].push(this.currentEpisode);
      // console.log(this.currentEpisode, 'first');
      // console.log('one');
      // delete all pieces in result container
      for (let i = 0; i < allChildren.length; i++) {
        const child = allChildren[i] as HTMLElement;
        child.classList.remove('incorrect');
        while (child.firstElementChild) {
          eventEmitter.emit('pushInPiece', child.firstElementChild);
          child.firstElementChild.remove();
        }
      }

      // теперь эелементы из game-container-pieces по одному переправляются в обратно после правильной сортировки
      eventEmitter.emit('clearPeaceContainer');
    };
    eventEmitter.on('autoCompleteSentence', this.autoCompleteSentence);
    this.pieceEventListener = (clickedElement: HTMLElement) => {
      // console.log('send piece to result');
      const newElement = this.createPieceElement(clickedElement);
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
      const countAllchildrenCurent = Array.from(allChildren).filter((child) => (child as HTMLElement).childElementCount > 0).length;
      if (this.countWordSentence === countAllchildrenCurent) {
        this.checkSentence(allChildren, eventEmitter);
      }
    };
    eventEmitter.on('piece', this.pieceEventListener);
    this.highlightIncorrectWords = () => {
      const currentChildren = allChildren;
      for (let j = 0; j < currentChildren.length; j++) {
        const partchild = currentChildren[j] as HTMLElement;
        partchild.classList.remove('incorrect');
        const word = this.textSentances.split(' ')[j];
        if (partchild.textContent) {
          if (partchild.textContent !== word) {
            partchild.classList.add('incorrect');
          }
        }
      }
    };
    eventEmitter.on('check-sentences', this.highlightIncorrectWords);
  }

  createPieceElement(clickedElement: HTMLElement): HTMLElement {
    const newElement = clickedElement;
    newElement.addEventListener('click', (event) => {
      if (event.target instanceof HTMLElement && (event.target.classList.contains('before') || event.target.classList.contains('after'))) {
        // Redirect the event to the parent div (the newElement)
        event.stopPropagation();
        newElement.click();
      } else {
        // Handle the click event normally
        this.handlePieceClick(event);
      }
    });

    // newElement.addEventListener('dragstart', this.dragStart);
    return newElement;
  }

  handlePieceClick(event: Event) {
    const eventEmitter = EventEmitter.getInstance();
    const clickedPiece = event.target as HTMLElement;
    const allChildren = Array.from(clickedPiece.parentElement!.parentElement!.children);

    for (let i = 0; i < allChildren.length; i++) {
      const child = allChildren[i] as HTMLElement;
      child.classList.remove('incorrect');
      if (child.contains(clickedPiece)) {
        eventEmitter.emit('pushInPiece', clickedPiece);
        child.removeChild(clickedPiece);
      }
    }
  }

  // dragStart(event: DragEvent) {
  //   const target = event.target as HTMLElement;
  //   if (target && target.dataset.dragIndex) {
  //     event.dataTransfer?.setData('text', target.dataset.dragIndex);
  //   } else {
  //     console.error('Drag target does not have an id');
  //   }
  // }

  checkSentence(allChildren: HTMLCollection, eventEmitter: EventEmitter) {
    eventEmitter.emit('check');
    const finalSrt: string[] = [];
    for (let i = 0; i < allChildren.length; i++) {
      const child = allChildren[i] as HTMLElement;
      if (child.textContent) {
        finalSrt.push(child.textContent);
      }
    }
    if (finalSrt.join(' ') === this.textSentances) {
      for (let i = 0; i < allChildren.length; i++) {
        const child = allChildren[i] as HTMLElement;
        child.classList.remove('incorrect');
        child.style.pointerEvents = 'none';
      }
      if (!this.customerAnswers[1].includes(this.currentEpisode)) {
        // console.log(this.customerAnswers[1].indexOf(this.currentEpisode), 'index');
        this.customerAnswers[0].push(this.currentEpisode);
      }
      eventEmitter.emit('auto-completeDisabel');
      eventEmitter.emit('check-remove');
      eventEmitter.emit('continue');
      // console.log(this.customerAnswers, 'this episode');
    }
  }

  updateView() {
    const eventEmitter = EventEmitter.getInstance();
    eventEmitter.emit('nextEpisode');
  }

  unsubscribe() {
    const eventEmitter = EventEmitter.getInstance();
    eventEmitter.unsubscribe('piece', this.pieceEventListener);
    eventEmitter.unsubscribe('autoCompleteSentence', this.autoCompleteSentence);
    eventEmitter.unsubscribe('check-sentences', this.highlightIncorrectWords);
  }

  unsubscribePiece() {
    if (this.peaceContainer) {
      this.peaceContainer.unsubscribe();
    }
  }

  unsubscribeNextEpisode() {
    const eventEmitter = EventEmitter.getInstance();
    eventEmitter.unsubscribe('setNextEpisode', this.setNextEpisodeHandler);
    eventEmitter.unsubscribe('StartNewRound', this.sendInfo);
    eventEmitter.unsubscribe('statisticSetInfo', this.statisticSetInfo);
  }

  nextRound() {
    const eventEmitter = EventEmitter.getInstance();
    const gameResultContainer = this.gameResultContainer.getElement();
    gameResultContainer.classList.add('complete');
    const roundWordCollection = this.wordCollection.rounds[this.round - 1].levelData;
    gameResultContainer.style.backgroundImage = `url(${getImgURL(roundWordCollection.imageSrc)})`;

    const allChildren = this.gameResultContainer.getElement().children;
    for (let i = 0; i < allChildren.length; i++) {
      const child = allChildren[i] as HTMLElement;
      child.style.opacity = '0';
    }
    this.peaceContainer.addNameYearAutor();
    // eventEmitter.emit('sendinfo', this.wordCollection, this.round);
    eventEmitter.emit('saveLastCompletedRound', this.wordCollection, this.round);
    eventEmitter.emit('andRound');
    this.sendInfo = () => {
      eventEmitter.emit('sendinfo', this.wordCollection, this.round);
      // const eventNames = eventEmitter.getAllListeners();
      // console.log(eventNames);
    };
    eventEmitter.on('StartNewRound', this.sendInfo);
    this.statisticSetInfo = () => {
      eventEmitter.emit('statistic', this.wordCollection, this.round, this.customerAnswers);
    };
    eventEmitter.on('statisticSetInfo', this.statisticSetInfo);
  }
}
