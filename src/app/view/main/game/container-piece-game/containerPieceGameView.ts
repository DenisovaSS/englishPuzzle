import './containerPieceGameView.css';
import View from '../../../view';
import {
  ElementParams,
  ElementCreator,
} from '../../../../utils/element-creator';
import wordCollectionLevel1 from '../../../../../data/wordCollectionLevel1.json';

const cssClasses = {
  PARTCONTAINER: 'game-container-pieces',
  BLOCKPIECE: 'item-piece',
};

export default class ContainerPieceGameView extends View {
  constructor() {
    const params: ElementParams = {
      tag: 'div',
      classNames: [cssClasses.PARTCONTAINER],
      textContent: '',
    };
    super(params);

    this.configureView();
  }

  configureView() {
    const sentence = wordCollectionLevel1.rounds[0].words[0].textExample;
    const arraysent = sentence.split(' ');
    const ass = this.randomArray(arraysent);
    console.log(ass);
    ass.forEach((word) => {
      const containerParam = {
        tag: 'div',
        classNames: [cssClasses.BLOCKPIECE],
        textContent: word,
      };
      const containerCreator = new ElementCreator(containerParam);
      this.elementCreator.addInnerElement(containerCreator.getElement());
    });
  }

  randomArray(array: string[]): string[] {
    const arrayCur = [...array];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arrayCur[i], arrayCur[j]] = [arrayCur[j], arrayCur[i]];
    }

    return arrayCur;
  }
}
