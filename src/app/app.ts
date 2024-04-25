import HeaderView from './view/header/header';
import MainView from './view/main/main';
import FooterView from './view/footer/footer';
import LoginView from './view/main/login/login_view';

export default class App {
  constructor() {
    this.createView();
  }

  createView() {
    const headerView = new HeaderView();
    const mainView = new MainView();
    mainView.setContent(new LoginView());
    const footerView = new FooterView();

    document.body.append(
      headerView.getHtmlElement(),
      mainView.getHtmlElement(),
      // eslint-disable-next-line @typescript-eslint/comma-dangle
      footerView.getHtmlElement()
    );
  }
}
