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
    const BtnAUTOCreator = new ElementCreator(BtnAUTOParam);
    const eventAuto = () => {
      eventEmitter.emit('autoCompleteSentence');
      BtnAUTOCreator.setDisabled(true);
      BtnAUTOCreator.removeEventHandler('click', eventAuto);
    };

    BtnAUTOCreator.setEventHandler('click', eventAuto);
    //
    this.elementCreator.addInnerElement(BtnAUTOCreator.getElement());
    const BtnCheckParam = {
      tag: 'button',
      classNames: [cssClasses.BUTTON, cssClasses.BTNCHECK],
      textContent: 'Check',
    };
    const BtnCheckCreator = new ElementCreator(BtnCheckParam);
    BtnCheckCreator.setDisabled(true);
    eventEmitter.on('check', () => {
      BtnCheckCreator.setDisabled(false);
      BtnCheckCreator.setEventHandler('click', this.checknewSentances);
    });
    eventEmitter.on('check-disabled', () => {
      BtnCheckCreator.setDisabled(true);
      BtnCheckCreator.removeEventHandler('click', this.checknewSentances);
    });
    eventEmitter.on('check-remove', () => {
      BtnCheckCreator.setCssClasses(['invisible']);
    });
    this.elementCreator.addInnerElement(BtnCheckCreator.getElement());
  }

  checknewSentances() {
    const eventEmitter = EventEmitter.getInstance();
    eventEmitter.emit('check-sentences');
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
