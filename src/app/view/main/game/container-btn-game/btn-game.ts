import './btn-game.css';
import View from '../../../view';
import {
  ElementParams,
  ElementCreator,
} from '../../../../utils/element-creator';
import EventEmitter from '../../../../utils/EventEmit';

const cssClasses = {
  BTNCONTAINER: 'game-btns-container',
  BTNAUTOCOMPLETE: 'auto-complete-button',
  BTNCONTINUE: 'continue-button',
  BTNCHECK: 'check-button',
  BUTTON: 'button',
};

export default class ContainerBtnGameView extends View {
  constructor() {
    const params: ElementParams = {
      tag: 'div',
      classNames: [cssClasses.BTNCONTAINER],
      textContent: '',
    };
    super(params);

    this.configureView();
  }

  configureView() {
    const eventEmitter = EventEmitter.getInstance();
    const BtnAUTOParam = {
      tag: 'button',
      classNames: [cssClasses.BUTTON, cssClasses.BTNAUTOCOMPLETE],
      textContent: 'Auto-complete',
    };
    const BtnBtnAUTOCreator = new ElementCreator(BtnAUTOParam);
    this.elementCreator.addInnerElement(BtnBtnAUTOCreator.getElement());
    const BtnCheckParam = {
      tag: 'button',
      classNames: [cssClasses.BUTTON, cssClasses.BTNCHECK],
      textContent: 'Check',
    };
    const BtnCheckCreator = new ElementCreator(BtnCheckParam);
    BtnCheckCreator.setDisabled(true);
    eventEmitter.on('check', () => {
      BtnCheckCreator.setDisabled(false);
    });
    eventEmitter.on('check-disabled', () => {
      BtnCheckCreator.setDisabled(true);
    });
    this.elementCreator.addInnerElement(BtnCheckCreator.getElement());
  }

  createBTN(classNames: Array<string>, textContent: string) {
    const BtnAUTOParam = {
      tag: 'button',
      classNames,
      textContent,
    };
    const BtnCreator = new ElementCreator(BtnAUTOParam);
    this.elementCreator.addInnerElement(BtnCreator.getElement());
    return BtnCreator;
  }

  removeBTN(btn: HTMLButtonElement) {
    btn.remove();
  }
}
