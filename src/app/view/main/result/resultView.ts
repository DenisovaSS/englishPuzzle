/* eslint-disable import/no-cycle */
import './resultView.css';
import View from '../../view';
import { ElementParams, ElementCreator } from '../../../utils/element-creator';
import MainView from '../main';
import GameView from '../game/game';

const cssClasses = {
  RESULT: 'result',
  H: 'title_result',
  BTNCONTINUE: 'continue-button',
  BUTTON: 'button',
};
const CARD_TEXT_MORE = 'Sign in';

export default class ResultView extends View {
  constructor(private mainView: MainView) {
    const params: ElementParams = {
      tag: 'section',
      classNames: [cssClasses.RESULT],
      textContent: '',
    };
    super(params);

    this.configureView();
  }

  configureView() {
    const paramsH = {
      tag: 'h1',
      classNames: [cssClasses.H],
      textContent: CARD_TEXT_MORE,
    };
    const HCreator = new ElementCreator(paramsH);
    const BtnContinueParam = {
      tag: 'button',
      classNames: [cssClasses.BUTTON, cssClasses.BTNCONTINUE],
      textContent: 'Auto-complete',
    };
    const BtnContinueCreator = new ElementCreator(BtnContinueParam);

    BtnContinueCreator.setEventHandler('click', () => this.handleContinue());
    this.elementCreator.addInnerElement(HCreator.getElement());
  }

  private handleContinue() {
    this.mainView.setContent(new GameView(this.mainView));
    console.log('goo');
  }
}
