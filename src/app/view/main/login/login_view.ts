import './login_view.css';
import View from '../../view';
import { ElementParams, ElementCreator } from '../../../utils/element-creator';

const cssClasses = {
  LOGIN: 'login',
  FORM: 'form',
  BUTTONFORM: 'customButton',
};
const FIELD_TEXT_ONE = 'First name:';
const FIELD_TEXT_TWO = 'Last name';
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
    const paramsForm: ElementParams = {
      tag: 'form',
      classNames: [],
      textContent: '',
    };
    const formCreator = new ElementCreator(paramsForm);
    this.elementCreator.addInnerElement(formCreator.getElement());
    let paramsInput: ElementParams = {
      tag: 'input',
      classNames: [],
      textContent: FIELD_TEXT_ONE,
    };
    let inputCreator = new ElementCreator(paramsInput);
    formCreator.addInnerElement(inputCreator.getElement());
    paramsInput = {
      tag: 'input',
      classNames: [],
      textContent: FIELD_TEXT_TWO,
    };
    inputCreator = new ElementCreator(paramsInput);
    formCreator.addInnerElement(inputCreator.getElement());
    const handleClick = (event: Event) => {
      console.log(`This is ${event.target}`);
    };
    const paramsButton = {
      tag: 'button',
      classNames: [cssClasses.BUTTONFORM],
      textContent: 'Login',
    };
    const buttonCreator = new ElementCreator(paramsButton);
    buttonCreator.setEventHandler('click', handleClick);

    formCreator.addInnerElement(buttonCreator.getElement());
  }
}
