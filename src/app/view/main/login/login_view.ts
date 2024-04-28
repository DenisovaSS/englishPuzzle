import './login_view.css';
import View from '../../view';
import { ElementParams, ElementCreator } from '../../../utils/element-creator';
import { FormParams, FormCreator } from '../../../utils/form-creator';
import MainView from '../main';
import WelcomeView from '../welcome/welcome';

const cssClasses = {
  LOGIN: 'login',
  H: 'title',
};
const CARD_TEXT_MORE = 'Sign in';

export default class LoginView extends View {
  constructor(private mainView: MainView) {
    const params: ElementParams = {
      tag: 'section',
      classNames: [cssClasses.LOGIN],
      textContent: '',
    };
    super(params);

    this.configureView();
  }

  configureView() {
    const paramsH = {
      tag: 'h1',
      classNames: [cssClasses.H],
      textContent: CARD_TEXT_MORE,
    };
    const HCreator = new ElementCreator(paramsH);

    this.elementCreator.addInnerElement(HCreator.getElement());
    const formParams: FormParams = {
      inputs: [
        {
          tag: 'input',
          classNames: ['form-input'],
          textContent: 'Enter your Name:',
          inputAttributes: {
            type: 'text',
            name: 'firstName',
            id: 'firstName',
            placeholder: 'Name',
          },
        },
        {
          tag: 'input',
          classNames: ['form-input'],
          textContent: 'Enter your Surname:',
          inputAttributes: {
            type: 'text',
            name: 'lastName',
            id: 'lastName',
            placeholder: 'Surname',
          },
        },
      ],
      buttonText: 'Submit',
      onSubmit: this.handleFormSubmit.bind(this),
    };
    const formCreator = new FormCreator(formParams);

    this.elementCreator.addInnerElement(formCreator.getElement());
  }

  private handleFormSubmit(event: Event) {
    event.preventDefault();
    this.mainView.setContent(new WelcomeView(this.mainView));
    console.log('Form submitted');
  }
}
