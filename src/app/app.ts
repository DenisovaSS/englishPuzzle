import HeaderView from './view/header/header';
import MainView from './view/main/main';
import FooterView from './view/footer/footer';
import { myKeySaveLocalStorage } from './utils/consts';
import LoginView from './view/main/login/login_view';
import WelcomeView from './view/main/welcome/welcome';
import GameView from './view/main/game/game';
import EventEmitter from './utils/EventEmit';

const eventEmitter = EventEmitter.getInstance();
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
      const eventNames = eventEmitter.getAllListeners();
      console.log('start game', eventNames);
    }

    eventEmitter.on('logout', () => {
      const eventNames = eventEmitter.getAllListeners();
      console.log('end game', eventNames);
      // console.log('2');
      localStorage.clear();
      eventEmitter.clearAllListenersExcept(['logout', 'startGame', 'getRounds', 'nextEpisode', 'saveLastCompletedRound', 'setRounds', 'sendinfo']);
      // console.log(eventEmitter.getEventNames());
      mainView.setContent(new LoginView(mainView));
    });
    eventEmitter.on('startGame', () => {
      mainView.setContent(new GameView(mainView));
    });
  }
}

// function scaleContent() {
//   const wrarper = document.getElementById('wrarper');
//   if (!wrarper) return;
//   const wrarperWidth = wrarper.offsetWidth;
//   const wrarperHeight = wrarper.offsetHeight;

//   const windowWidth = window.innerWidth;
//   const windowHeight = window.innerHeight;

//   const scaleX = windowWidth / wrarperWidth;
//   const scaleY = windowHeight / wrarperHeight;

//   const scale = Math.min(scaleX, scaleY);
//   // @ts-ignore
//   wrarper.style.zoom = String(scale);
//   document.body.style.height = `${wrarperHeight * scale}px`;
// }
// window.addEventListener('resize', scaleContent);
// scaleContent();
