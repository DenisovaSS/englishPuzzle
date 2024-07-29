import HeaderView from './view/header/header';
import MainView from './view/main/main';
import FooterView from './view/footer/footer';
import { myKeySaveLocalStorage } from './utils/consts';
import LoginView from './view/main/login/login_view';
import WelcomeView from './view/main/welcome/welcome';
import ResultView from './view/main/result/resultView';
import GameView from './view/main/game/game';
import EventEmitter from './utils/EventEmit';

export default class App {
  constructor() {
    this.createView();
  }

  createView() {
    const headerView = new HeaderView();
    const mainView = new MainView();
    // mainView.setContent(new GameView(mainView));
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
    } else {
      mainView.setContent(new LoginView(mainView));
    }
    const eventEmitter = EventEmitter.getInstance();
    eventEmitter.on('logout', () => {
      // console.log('2');
      localStorage.clear();
      mainView.setContent(new LoginView(mainView));
    });
    eventEmitter.on('startGame', () => {
      // console.log('1');
      mainView.setContent(new GameView(mainView));
    });
    eventEmitter.on('statistic', () => {
      // console.log('1');
      mainView.setContent(new ResultView(mainView));
    });
  }
}
