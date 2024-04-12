import MainView from './view/main/main';
import FooterView from './view/footer/footer';

export default class App {
  constructor() {
    this.createView();
  }

  createView() {
    const mainView = new MainView();

    const footerView = new FooterView();
    if (mainView && footerView) {
      document.body.append(
        mainView.getHtmlElement(),
        // eslint-disable-next-line @typescript-eslint/comma-dangle
        footerView.getHtmlElement()
      );
    }
  }
}
