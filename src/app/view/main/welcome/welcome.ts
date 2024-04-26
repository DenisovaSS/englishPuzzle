import './welcome.css';
import View from '../../view';
import { ElementParams, ElementCreator } from '../../../utils/element-creator';
import { myKeySaveLocalStorage } from '../../../utils/consts';

const cssClasses = {
  START: 'start-page',
  GAMENAME: 'title_start',
  GAMEDESCRIPTION: 'description',
  WELCOMENAME: 'greeting',
  BTNCONTAINER: 'btns-container',
  BUTTONSTART: ['button', 'start-button'],
  BUTTONLOGOOUT: ['button', 'logout-button'],
};
const TEXT_GAME_NAME = 'RSS PUZZLE';
// eslint-disable-next-line operator-linebreak
const TEXT_GAME_DESCRIPTION =
  'RSS Puzzle is a fun platform for learning English where you will have to make sentences out of words.';

export default class WelcomeView extends View {
  constructor() {
    const params: ElementParams = {
      tag: 'section',
      classNames: [cssClasses.START],
      textContent: '',
    };
    super(params);

    this.configureView();
  }

  configureView() {
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
      classNames: [cssClasses.WELCOMENAME],
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
}
