import LoginPage from './login/login';

class App {
  private container: HTMLElement;

  private initialPage: LoginPage;

  constructor() {
    this.container = document.body;
    this.initialPage = new LoginPage('login');
  }

  run() {
    const startPageHTML = this.initialPage.render();
    this.container.append(startPageHTML);
  }
}
export default App;
