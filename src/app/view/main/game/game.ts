import './game.css';
import View from '../../view';
import { ElementParams, WordCollection } from '../../../utils/element-creator';
import HeaderGameView from './header-game/headerGameView';
import MainView from '../main';
// import ContainerPieceGameView from './container-piece-game/containerPieceGameView';
import ResultGameView from './result-game/resultGameView';
import ContainerBtnGameView from './container-btn-game/btn-game';
import LevelInfo from '../../../utils/levelRound';
import EventEmitter from '../../../utils/EventEmit';
import { myKeySaveLocalStorage } from '../../../utils/consts';

const cssClasses = {
  SECTIONG: 'game-page',
  CONTAINER: 'game-content-container',
  HEADERG: 'header-game',
  RESULT: 'game-result-container',
  PARTCONTAINER: 'game-container-pieces',
  BTNCONTAINER: 'game-btns-container',
};

export default class GameView extends View {
  private resultContainer!: ResultGameView;

  private changeLevelHandler!: (wordCollection: WordCollection, currentRound: number) => void;

  private changeRoundHandler!: (wordCollection: WordCollection, currentRound: number) => void;

  private newEpisodeHandler!: () => void;

  constructor(private mainView: MainView) {
    const params: ElementParams = {
      tag: 'section',
      classNames: [cssClasses.SECTIONG],
      textContent: '',
    };
    super(params);

    this.configureView();
    this.setupEventListeners();
  }

  configureView() {
    const eventEmitter = EventEmitter.getInstance();
    const headerCreator = new HeaderGameView(this.mainView);
    this.elementCreator.addInnerElement(headerCreator.getHtmlElement());
    const localStorageInfo = localStorage.getItem(myKeySaveLocalStorage);
    if (localStorageInfo !== null) {
      const lastCompleteGame = JSON.parse(localStorageInfo).lastRound;
      if (lastCompleteGame) {
        const currentWordCollection = lastCompleteGame.lastwordCollection;
        const currentRound = lastCompleteGame.nextRoundStart;
        const currentLevel = lastCompleteGame.lastLevel;
        // eventEmitter.emit('lastCompleteGameStart', lastCompleteGame.level, lastCompleteGame.round);
        this.resultContainer = new ResultGameView(currentWordCollection, currentRound);
        eventEmitter.emit('NextRoundHeader', currentLevel + 1, currentRound);
      } else { this.resultContainer = new ResultGameView(LevelInfo.wordCollection, LevelInfo.currentRound); }
    }
    this.elementCreator.addInnerElement(this.resultContainer.getHtmlElement());
    const BTNContainer = new ContainerBtnGameView();
    this.elementCreator.addInnerElement(BTNContainer.getHtmlElement());
    this.newEpisodeHandler = () => {
      this.resultContainer.unsubscribe();
      this.resultContainer.updateView();
    };
    eventEmitter.on('newEpisode', this.newEpisodeHandler);
  }

  setupEventListeners() {
    const eventEmitter = EventEmitter.getInstance();
    this.changeLevelHandler = (wordCollection, currentRound) => this.updateView(wordCollection, currentRound);
    this.changeRoundHandler = (wordCollection, currentRound) => this.updateView(wordCollection, currentRound);
    eventEmitter.on('changeLevel', this.changeLevelHandler);
    eventEmitter.on('changeRound', this.changeRoundHandler);
    eventEmitter.on('NextRound', (wordCollection, currentRound) => this.updateView(wordCollection, currentRound));
  }

  updateView(wordCollection: WordCollection, round: number) {
    const eventEmitter = EventEmitter.getInstance();
    const containerCreator = this.elementCreator.getElement();
    this.resultContainer.unsubscribeNextEpisode();
    this.resultContainer.unsubscribe();
    this.resultContainer.unsubscribePiece();
    const oldResultContainer = this.resultContainer.getHtmlElement();
    const { nextSibling } = oldResultContainer;
    containerCreator.removeChild(oldResultContainer);
    this.resultContainer = new ResultGameView(wordCollection, round);
    if (nextSibling) {
      containerCreator.insertBefore(this.resultContainer.getHtmlElement(), nextSibling);
    } else {
      containerCreator.appendChild(this.resultContainer.getHtmlElement());
    }
    eventEmitter.emit('startButton');
  }

  // unsubscribe() {
  //   const eventEmitter = EventEmitter.getInstance();
  //   eventEmitter.unsubscribe('changeLevel', this.changeLevelHandler);
  //   eventEmitter.unsubscribe('changeRound', this.changeRoundHandler);
  // }

  unsubscribeNewEpisode() {
    const eventEmitter = EventEmitter.getInstance();
    eventEmitter.unsubscribe('newEpisode', this.newEpisodeHandler);
  }
}
