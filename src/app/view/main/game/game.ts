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
    // const containerParam = {
    //   tag: 'div',
    //   classNames: [cssClasses.CONTAINER],
    //   textContent: '',
    // };

    // const containerCreator = new ElementCreator(containerParam);
    // this.elementCreator.addInnerElement(containerCreator.getElement());
    const eventEmitter = EventEmitter.getInstance();
    const headerCreator = new HeaderGameView(this.mainView);
    this.elementCreator.addInnerElement(headerCreator.getHtmlElement());
    this.resultContainer = new ResultGameView(LevelInfo.wordCollection, LevelInfo.currentRound);
    eventEmitter.on('newEpisode', () => {
      this.resultContainer.unsubscribe();
      this.resultContainer.updateView();
    });
    this.elementCreator.addInnerElement(this.resultContainer.getHtmlElement());
    // const peaceContainer = new ContainerPieceGameView(LevelInfo.wordCollection, LevelInfo.currentRound, LevelInfo.currentEpisode);
    // this.elementCreator.addInnerElement(peaceContainer.getHtmlElement());
    const BTNContainer = new ContainerBtnGameView();
    this.elementCreator.addInnerElement(BTNContainer.getHtmlElement());
  }

  setupEventListeners() {
    const eventEmitter = EventEmitter.getInstance();
    eventEmitter.on('changeLevel', (wordCollection, currentRound) => this.updateView(wordCollection, currentRound));
    eventEmitter.on('changeRound', (wordCollection, currentRound) => this.updateView(wordCollection, currentRound));
  }

  updateView(wordCollection: WordCollection, round: number) {
    // console.log(wordCollection);
    const eventEmitter = EventEmitter.getInstance();
    const containerCreator = this.elementCreator.getElement();
    this.resultContainer.unsubscribe();
    const oldResultContainer = this.resultContainer.getHtmlElement();
    const eventNames = eventEmitter.getEventNames();
    console.log(eventNames);
    const { nextSibling } = oldResultContainer;
    containerCreator.removeChild(oldResultContainer);
    this.resultContainer = new ResultGameView(wordCollection, round);
    if (nextSibling) {
      containerCreator.insertBefore(this.resultContainer.getHtmlElement(), nextSibling);
    } else {
      containerCreator.appendChild(this.resultContainer.getHtmlElement());
    }
  }
}
