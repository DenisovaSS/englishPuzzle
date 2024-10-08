import './footer.css';
import View from '../view';
import { ElementParams } from '../../utils/element-creator';
import logo from '../../../img/sd.svg';

const cssClasses = {
  FOOTER: 'footer',
};
// <a class="real_footer_github" href="https://github.com/DenisovaSS" target="_blank">DenisovaSS</a>
export default class FooterView extends View {
  constructor() {
    const params: ElementParams = {
      tag: 'footer',
      classNames: [cssClasses.FOOTER],
      textContent: '',
    };
    super(params);
    this.configureView();
  }

  configureView() {
    const imgParam = document.createElement('img') as HTMLImageElement;
    imgParam.src = logo;
    imgParam.classList.add('logo');
    this.elementCreator.addInnerElement(imgParam);
    const link = document.createElement('a') as HTMLAnchorElement;
    link.classList.add('linkForFooter');
    link.href = 'https://github.com/DenisovaSS';
    link.textContent = 'Denisova';
    link.target = '_blank';
    this.elementCreator.addInnerElement(link);
  }
}
