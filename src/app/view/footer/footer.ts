import './footer.css';
import View from '../view';
import { ElementParams } from '../../utils/element-creator';

const cssClasses = {
  FOOTER: 'footer',
};
const TEXT = 'this is footer';
export default class FooterView extends View {
  constructor() {
    const params: ElementParams = {
      tag: 'footer',
      classNames: [cssClasses.FOOTER],
      textContent: TEXT,
    };
    super(params);
  }
}
