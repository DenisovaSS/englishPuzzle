import './login.scss';
import {
  createElement,
  createInputElement,
  createLabelElement,
} from '../../core/utils';

class LoginPage {
  private container: HTMLElement;

  constructor(id: string) {
    this.container = document.createElement('div');
    this.container.id = id;
  }

  // eslint-disable-next-line class-methods-use-this
  protected createLoginForm() {
    const form = createElement('form', ['form']);
    createElement('div', ['title_log_reg'], form, 'Login');
    createLabelElement('fname', ['labelName'], form, 'First name:');
    createInputElement('fname', 'text', form, 'fname').required = true;
    createLabelElement('lname', ['labelName'], form, 'Last name:');
    createInputElement('lname', 'text', form, 'lname').required = true;
    const buttonElement = createInputElement(
      'customButton',
      'submit',
      form,
      'labelNameLast',
      'Login',
    );
    buttonElement.addEventListener('click', () => {
      console.log('click');
    });
    return form;
  }

  render() {
    const form = this.createLoginForm();
    this.container.append(form);
    return this.container;
  }
}
export default LoginPage;
