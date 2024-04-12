import './main.css';
import View from '../view';
import { ElementParams } from '../../utils/element-creator';

const cssClasses = {
  // eslint-disable-next-line @typescript-eslint/comma-dangle
  MAIN: 'main',
};
export default class MainView extends View {
  constructor() {
    const params: ElementParams = {
      tag: 'main',
      classNames: [cssClasses.MAIN],
      textContent: 'Hello first main',
    };
    super(params);
  }

  //   setContent(view: View) {
  //     const element = view.getHtmlElement();
  //     const currentElement = this.elementCreator.getElement();
  //     if (currentElement) {
  //       while (currentElement.firstElementChild) {
  //         currentElement.firstElementChild.remove();
  //       }
  //       currentElement.append(element || '');
  //     }
  //   }
}
