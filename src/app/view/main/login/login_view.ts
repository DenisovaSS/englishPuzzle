import './login_view.css';
import View from '../../view';
import { ElementParams } from '../../../utils/element-creator';
import { FormParams, FormCreator } from '../../../utils/form-creator';

const cssClasses = {
  LOGIN: 'login',
};
const formParams: FormParams = {
  inputs: [
    {
      tag: 'input',
      classNames: ['form-input'],
      textContent: 'First Name:',
      inputAttributes: {
        type: 'text',
        name: 'firstName',
        id: 'firstName',
        placeholder: 'Enter your first name',
      },
    },
    {
      tag: 'input',
      classNames: ['form-input'],
      textContent: 'Last Name:',
      inputAttributes: {
        type: 'text',
        name: 'lastName',
        id: 'lastName',
        placeholder: 'Enter your last name',
      },
    },
  ],
  buttonText: 'Submit',
};
export default class LoginView extends View {
  constructor() {
    const params: ElementParams = {
      tag: 'div',
      classNames: [cssClasses.LOGIN],
      textContent: '',
    };
    super(params);

    this.configureView();
  }

  configureView() {
    const formCreator = new FormCreator(formParams);
    this.elementCreator.addInnerElement(formCreator.getElement());
  }
}
