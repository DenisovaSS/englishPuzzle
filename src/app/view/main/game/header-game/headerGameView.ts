import './headerGameView.css';
import View from '../../../view';
import {
  ElementParams,
  ElementCreator,
} from '../../../../utils/element-creator';
import MainView from '../../main';
import LoginView from '../../login/login_view';

const cssClasses = {
  HEADERG: 'header-game',
  BLOCKSETTING: 'setting-block',
  BLOCKHINTS: 'hints-block',
  BUTTONLOGOOUT: 'logout-button',
  BUTTON: 'button',
};

export default class HeaderGameView extends View {
  constructor(public mainView: MainView) {
    const params: ElementParams = {
      tag: 'div',
      classNames: [cssClasses.HEADERG],
      textContent: '',
    };
    super(params);

    this.configureView();
  }

  configureView() {
    const containerParam = {
      tag: 'div',
      classNames: [cssClasses.BLOCKSETTING],
      textContent: '',
    };
    const containerCreator = new ElementCreator(containerParam);
    this.elementCreator.addInnerElement(containerCreator.getElement());

    const BtnLogOutParam = {
      tag: 'button',
      classNames: [cssClasses.BUTTON, cssClasses.BUTTONLOGOOUT],
      textContent: 'Logout',
    };
    const BtnLogOutCreator = new ElementCreator(BtnLogOutParam);
    BtnLogOutCreator.setEventHandler('click', () => {
      this.mainView.setContent(new LoginView(this.mainView));
    });
    containerCreator.addInnerElement(BtnLogOutCreator.getElement());
  }
}
