import HeaderView from './view/header/header';
import MainView from './view/main/main';
import FooterView from './view/footer/footer';
import { myKeySaveLocalStorage } from './utils/consts';
import LoginView from './view/main/login/login_view';
import WelcomeView from './view/main/welcome/welcome';
import GameView from './view/main/game/game';
import EventEmitter from './utils/EventEmit';

export default class App {
  constructor() {
    this.createView();
  }

  createView() {
    const headerView = new HeaderView();
    const mainView = new MainView();
    // mainView.setContent(new LoginView());
    this.renderNewPage(mainView);
    const footerView = new FooterView();

    document.body.append(
      headerView.getHtmlElement(),
      mainView.getHtmlElement(),
      // eslint-disable-next-line @typescript-eslint/comma-dangle
      footerView.getHtmlElement()
    );
  }

  renderNewPage(mainView: MainView) {
    const customerDataString = localStorage.getItem(myKeySaveLocalStorage);
    if (customerDataString !== null) {
      mainView.setContent(new WelcomeView(mainView));
      const eventEmitter = EventEmitter.getInstance();
      eventEmitter.on('logout', () => {
        mainView.setContent(new LoginView(mainView));
      });
      eventEmitter.on('startGame', () => {
        mainView.setContent(new GameView(mainView));
      });
    } else {
      mainView.setContent(new LoginView(mainView));
    }
  }
}
