import './welcome.css';
import View from '../../view';
import { ElementParams, ElementCreator } from '../../../utils/element-creator';
import { myKeySaveLocalStorage } from '../../../utils/consts';
import MainView from '../main';

// import LoginView from '../login/login_view';
// import GameView from '../game/game';
import EventEmitter from '../../../utils/EventEmit';

const cssClasses = {
  START: 'start-page',
  GAMENAME: 'title_start',
  GAMEDESCRIPTION: 'description',
  WELCOMENAME: 'greeting',
  ANIMATION: 'fancy',
  BTNCONTAINER: 'btns-container',
  BUTTON: 'button',
  BUTTONSTART: 'start-button',
  BUTTONLOGOOUT: 'logout-button',
};
const TEXT_GAME_NAME = 'RSS PUZZLE';
// eslint-disable-next-line operator-linebreak
const TEXT_GAME_DESCRIPTION =
  'RSS Puzzle is a fun platform for learning English where you will have to make sentences out of words.';

export default class WelcomeView extends View {
  constructor(private mainView: MainView) {
    const params: ElementParams = {
      tag: 'section',
      classNames: [cssClasses.START],
      textContent: '',
    };
    super(params);

    this.configureView();
  }

  configureView() {
    const eventEmitter = EventEmitter.getInstance();
    const titleParam = {
      tag: 'h1',
      classNames: [cssClasses.GAMENAME],
      textContent: TEXT_GAME_NAME,
    };
    const titleCreator = new ElementCreator(titleParam);
    this.elementCreator.addInnerElement(titleCreator.getElement());

    const descrParam = {
      tag: 'p',
      classNames: [cssClasses.GAMEDESCRIPTION],
      textContent: TEXT_GAME_DESCRIPTION,
    };
    const descrCreator = new ElementCreator(descrParam);
    this.elementCreator.addInnerElement(descrCreator.getElement());

    const welcParam = {
      tag: 'h2',
      classNames: [cssClasses.WELCOMENAME, cssClasses.ANIMATION],
      textContent: this.greetingCustomer(),
    };
    const welcCreator = new ElementCreator(welcParam);
    this.elementCreator.addInnerElement(welcCreator.getElement());
    const ContBtnParam = {
      tag: 'div',
      classNames: [cssClasses.BTNCONTAINER],
      textContent: '',
    };
    const ContBtnCreator = new ElementCreator(ContBtnParam);
    this.elementCreator.addInnerElement(ContBtnCreator.getElement());
    const BtnStartParam = {
      tag: 'button',
      classNames: [cssClasses.BUTTON, cssClasses.BUTTONSTART],
      textContent: 'Start',
    };
    const BtnStartCreator = new ElementCreator(BtnStartParam);
    BtnStartCreator.setEventHandler('click', () => {

      // this.mainView.setContent(new GameView(this.mainView));
      eventEmitter.emit('startGame');

    });
    ContBtnCreator.addInnerElement(BtnStartCreator.getElement());
    const BtnLogOutParam = {
      tag: 'button',
      classNames: [cssClasses.BUTTON, cssClasses.BUTTONLOGOOUT],
      textContent: 'Logout',
    };
    const BtnLogOutCreator = new ElementCreator(BtnLogOutParam);
    BtnLogOutCreator.setEventHandler('click', () => {
      // this.mainView.setContent(new LoginView(this.mainView));
      eventEmitter.emit('logout');
      console.log('Blin');
    });
    ContBtnCreator.addInnerElement(BtnLogOutCreator.getElement());
  }

  greetingCustomer(): string {
    let welcome = 'hello dear guest';
    const customerDataString = localStorage.getItem(myKeySaveLocalStorage);
    if (customerDataString) {
      const customerData = JSON.parse(customerDataString);
      const { firstName, lastName } = customerData;
      welcome = `Welcome in game, ${firstName} ${lastName}`;
      console.log(customerDataString);
    }

    return welcome;
  }

  nextPage() {
    console.log('here change to Page Game');
  }

  //   beforePage() {

  //   }
}
