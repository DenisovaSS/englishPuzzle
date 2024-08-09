import './header.css';
import View from '../view';
import { ElementParams } from '../../utils/element-creator';
// import logo from '../../../img/sd.svg';

const CssClasses = {
  HEADER: 'header',
  LOGO: 'logotype',
};

export default class HeaderView extends View {
  constructor() {
    const params: ElementParams = {
      tag: 'header',
      classNames: [CssClasses.HEADER],
      textContent: '',
    };
    super(params);
    this.configureView();
  }

  configureView() {
    // const imgParam = document.createElement('img') as HTMLImageElement;
    // imgParam.src = logo;
    // imgParam.classList.add('logo');
    // this.elementCreator.addInnerElement(imgParam);
    console.log('hello word');
  }
}
