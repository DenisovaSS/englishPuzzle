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
import StatisticView from './statistic/statisticView';

const eventEmitter = EventEmitter.getInstance();
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

  private statisticView?: StatisticView;

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
    const headerCreator = new HeaderGameView(this.mainView);
    this.elementCreator.addInnerElement(headerCreator.getHtmlElement());
    const localStorageInfo = localStorage.getItem(myKeySaveLocalStorage);
    if (localStorageInfo !== null) {
      const lastCompleteGame = JSON.parse(localStorageInfo).lastRound;
      if (lastCompleteGame) {
        const currentLevel:number = +lastCompleteGame.lastLevel;
        const currentWordCollection = LevelInfo.wordCollections[currentLevel];

        const contRounds = LevelInfo.wordCollections[currentLevel].roundsCount;

        const currentRound:number = +lastCompleteGame.nextRoundStart;
        this.resultContainer = new ResultGameView(currentWordCollection, currentRound);
        eventEmitter.emit('NextRoundHeader', currentLevel, currentRound, contRounds);
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
    eventEmitter.on('statistic', (wordCollection, currentRound, answerArray) => {
      this.statisticView = new StatisticView(wordCollection, currentRound, answerArray);
      this.elementCreator.addInnerElement(this.statisticView.getHtmlElement());
      // console.log(resultGame);
    });
  }

  setupEventListeners() {
    this.changeLevelHandler = (wordCollection, currentRound) => this.updateView(wordCollection, currentRound);
    this.changeRoundHandler = (wordCollection, currentRound) => this.updateView(wordCollection, currentRound);
    eventEmitter.on('changeLevel', this.changeLevelHandler);
    eventEmitter.on('changeRound', this.changeRoundHandler);
    eventEmitter.on('NextRound', (wordCollection, currentRound) => {
      this.updateView(wordCollection, currentRound);
      if (this.statisticView) {
        // const oldStatisticContainer = this.statisticView.getHtmlElement();
        // const containerCreator = this.elementCreator.getElement();
        // containerCreator.removeChild(oldStatisticContainer);
        // this.statisticView = undefined;
        this.statisticView.getHtmlElement().remove();
      }
    });
  }

  updateView(wordCollection: WordCollection, round: number) {
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
  //
  //   eventEmitter.unsubscribe('changeLevel', this.changeLevelHandler);
  //   eventEmitter.unsubscribe('changeRound', this.changeRoundHandler);
  // }

  unsubscribeNewEpisode() {
    eventEmitter.unsubscribe('newEpisode', this.newEpisodeHandler);
  }
}
