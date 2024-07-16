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

    BtnAUTOCreator.setEventHandler('click', (e) => this.eventAuto(e));
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
      const visible = BtnCheckCreator.getElement().classList.contains('invisible');
      if (visible) { BtnCheckCreator.getElement().classList.remove('invisible'); }
      BtnCheckCreator.setDisabled(true);
      BtnCheckCreator.removeEventHandler('click', this.checknewSentances);
    });
    eventEmitter.on('check-remove', () => {
      BtnCheckCreator.setCssClasses(['invisible']);
    });
    this.elementCreator.addInnerElement(BtnCheckCreator.getElement());
    eventEmitter.on('continue', () => {
      const continueBTN = this.createBTN(['button', 'continue-button'], 'continue');
      continueBTN.setEventHandler('click', (e) => this.clickContinueBtn(e));
    });
    eventEmitter.on('startButton', () => {
      const continueBTN = this.elementCreator.getElement().querySelector('.continue-button');
      if (continueBTN) {
        continueBTN.remove();
      }
      eventEmitter.emit('check-disabled');
      BtnAUTOCreator.setDisabled(false);
    });
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

  clickContinueBtn(e:Event) {
    const eventEmitter = EventEmitter.getInstance();
    const target = e.target as HTMLButtonElement;
    const BtnAUTOCreator = target.parentElement?.firstChild as HTMLButtonElement;
    BtnAUTOCreator.disabled = false;
    // console.log(target.parentElement?.firstChild);

    this.removeBTN(target);
    eventEmitter.emit('newEpisode');

    eventEmitter.emit('check-disabled');
  }

  eventAuto(e:Event) {
    const eventEmitter = EventEmitter.getInstance();
    const target = e.target as HTMLButtonElement;
    eventEmitter.emit('autoCompleteSentence');
    const eventNames = eventEmitter.getAllListeners();
    console.log(eventNames);
    target.disabled = true;
    // target.removeEventListener('click', this.eventAuto);
  }
}
