import './game.css';
import View from '../../view';
import { ElementParams, ElementCreator } from '../../../utils/element-creator';
import HeaderGameView from './header-game/headerGameView';
import MainView from '../main';

const cssClasses = {
  SECTIONG: 'game-page',
  CONTAINER: 'game-content-container',
  HEADERG: 'header-game',
  RESULT: 'game-result-container',
  PARTCONTAINER: 'game-container-pieces',
  BTNCONTAINER: 'game-btns-container',
};

export default class GameView extends View {
  constructor(private mainView: MainView) {
    const params: ElementParams = {
      tag: 'section',
      classNames: [cssClasses.SECTIONG],
      textContent: '',
    };
    super(params);

    this.configureView();
  }

  configureView() {
    const containerParam = {
      tag: 'div',
      classNames: [cssClasses.CONTAINER],
      textContent: '',
    };
    const containerCreator = new ElementCreator(containerParam);
    this.elementCreator.addInnerElement(containerCreator.getElement());

    const headerCreator = new HeaderGameView(this.mainView);
    containerCreator.addInnerElement(headerCreator.getHtmlElement());
  }
}
