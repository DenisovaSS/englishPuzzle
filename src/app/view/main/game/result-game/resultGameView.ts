import './resultGameView.css';
import View from '../../../view';
import {
  ElementParams,
  ElementCreator,
} from '../../../../utils/element-creator';
import EventEmitter from '../../../../utils/EventEmit';
import LevelInfo from '../../../../utils/levelRound';
import { getImgURL } from '../../../../utils/fileLoader';

const wordCollection = LevelInfo.currentEpisodePart.textExample;
const roundWordCollection = LevelInfo.wordCollection.rounds[LevelInfo.currentRound - 1].levelData;
console.log(wordCollection);
const arrayAnswer = wordCollection.split(' ');
const cssClasses = {
  RESULT: 'game-result-container',
  PARTRESULT: 'game-result-container-part',
  PARTPIECE: 'game-result-container-part-piece',
  BLOCKPIECE: 'item-piece',
  SPANPIECEBEFORE: 'before',
  SPANPIECEAFTER: 'after',
};
const countWordSentence: number = arrayAnswer.length;
export default class ResultGameView extends View {
  constructor() {
    const params: ElementParams = {
      tag: 'div',
      classNames: [cssClasses.RESULT],
      textContent: '',
    };
    super(params);

    const containerCreator = this.configureView();
    this.fillField(containerCreator);
  }

  configureView() {
    const containerCreator = this.containerDivCreator(cssClasses.PARTRESULT);
    // containerCreator.getElement().dataset.index = '0';
    const gameResultContainer = this.elementCreator.getElement();
    // console.log(getImgURL(roundWordCollection.imageSrc));
    gameResultContainer.style.background = `url(${getImgURL(roundWordCollection.imageSrc)})`;

    this.elementCreator.addInnerElement(containerCreator.getElement());

    for (let i = 0; i < countWordSentence; i++) {
      const containerPieceCreator = this.containerDivCreator(cssClasses.PARTPIECE);
      const currentPieceCreator = containerPieceCreator.getElement();
      currentPieceCreator.style.width = `${702 / countWordSentence}px`;
      currentPieceCreator.addEventListener('dragover', this.handleDragOver);
      // currentPieceCreator.addEventListener('dragleave', this.handleDragLeave);
      currentPieceCreator.addEventListener('drop', this.handleDragDrop.bind(this));
      // containerPieceCreator.setId(String(i));
      containerCreator.addInnerElement(currentPieceCreator);
    }
    return containerCreator;
  }

  containerDivCreator(classNames: string) {
    const containerParam = {
      tag: 'div',
      classNames: [classNames],
      textContent: '',
    };
    return new ElementCreator(containerParam);
  }

  handleDragOver(e: Event) {
    e.preventDefault();
  }

  handleDragDrop(e: DragEvent) {
    const eventEmitter = EventEmitter.getInstance();
    const target = e.target as HTMLElement;
    const currentTarget = e.currentTarget as HTMLElement;

    const article = document.querySelector(`[data-index='${e.dataTransfer?.getData('text')}']`);
    if (article) {
      if (target.classList.contains(cssClasses.PARTPIECE)) {
        target.appendChild(article);
      } else if (target.classList.contains(cssClasses.BLOCKPIECE)) {
        const oldParent = article.parentElement;
        target.parentElement?.appendChild(article);
        oldParent?.appendChild(target);
      } else {
        eventEmitter.emit('DropInPiece', article);
      }
    }
    const container = currentTarget.parentElement?.children;
    if (container) {
      const countAllchildrenCurent = Array.from(container).filter((child) => (child as HTMLElement).childElementCount > 0).length;
      if (countAllchildrenCurent === countWordSentence) {
        this.checkSentence(container, eventEmitter);
      }
    }
  }

  fillField(containerCreator: ElementCreator) {
    const eventEmitter = EventEmitter.getInstance();

    const currentContainerCreator = containerCreator.getElement();
    const allChildren = currentContainerCreator.children;
    eventEmitter.on('autoCompleteSentence', () => this.autoCompleteSentence(allChildren));
    eventEmitter.on('piece', (clickedElement: HTMLElement) => this.pieceEventListener(clickedElement, allChildren, eventEmitter));
  }

  autoCompleteSentence(allChildren: HTMLCollection) {
    const eventEmitter = EventEmitter.getInstance();
    // delete all pieces in result container
    for (let i = 0; i < allChildren.length; i++) {
      const child = allChildren[i] as HTMLElement;
      child.classList.remove('incorrect');
      while (child.firstElementChild) {
        eventEmitter.emit('pushInPiece', child.firstElementChild);
        child.firstElementChild.remove();
      }
    }
    arrayAnswer.forEach((word, index) => {
      const newElement = this.createPuzzlePiece(word, index);
      allChildren[index].append(newElement);
    });
    eventEmitter.emit('clearPeaceContainer');
    eventEmitter.emit('check-remove');
    eventEmitter.emit('continue');
  }

  pieceEventListener(clickedElement: HTMLElement, allChildren: HTMLCollection, eventEmitter: EventEmitter) {
    const newElement = this.createPieceElement(clickedElement);
    let childIndex = 0;
    while (
      // eslint-disable-next-line operator-linebreak
      childIndex < allChildren.length &&
      allChildren[childIndex].childElementCount > 0
    ) {
      childIndex++;
    }
    if (childIndex < allChildren.length) {
      allChildren[childIndex].append(newElement);
    }
    const countAllchildrenCurent = Array.from(allChildren).filter((child) => (child as HTMLElement).childElementCount > 0).length;
    console.log(countWordSentence === countAllchildrenCurent);
    if (countWordSentence === countAllchildrenCurent) {
      this.checkSentence(allChildren, eventEmitter);
    }
  }

  createPieceElement(clickedElement: HTMLElement): HTMLElement {
    const newElement = clickedElement;
    // newElement.classList.add(cssClasses.BLOCKPIECE);
    // newElement.textContent = clickedElement.textContent;
    // newElement.draggable = true;
    // newElement.dataset.index = clickedElement.dataset.index;
    newElement.addEventListener('click', (event) => this.handlePieceClick(event));
    newElement.addEventListener('dragstart', this.dragStart);
    return newElement;
  }

  handlePieceClick(event: Event) {
    const eventEmitter = EventEmitter.getInstance();
    const clickedPiece = event.target as HTMLElement;
    const allChildren = Array.from(clickedPiece.parentElement!.parentElement!.children);

    for (let i = 0; i < allChildren.length; i++) {
      const child = allChildren[i] as HTMLElement;
      // child.classList.remove('incorrect');
      if (child.contains(clickedPiece)) {
        eventEmitter.emit('pushInPiece', clickedPiece);
        child.removeChild(clickedPiece);
      }
    }
  }

  dragStart(event: DragEvent) {
    const target = event.target as HTMLElement;
    if (target && target.dataset.index) {
      event.dataTransfer?.setData('text', target.dataset.index);
    } else {
      console.error('Drag target does not have an id');
    }
  }

  checkSentence(allChildren: HTMLCollection, eventEmitter: EventEmitter) {
    eventEmitter.emit('check');
    const finalSrt: string[] = [];
    for (let i = 0; i < allChildren.length; i++) {
      const child = allChildren[i] as HTMLElement;
      if (child.textContent) {
        finalSrt.push(child.textContent);
      }
    }
    if (finalSrt.join(' ') === wordCollection) {
      for (let i = 0; i < allChildren.length; i++) {
        const child = allChildren[i] as HTMLElement;
        child.classList.remove('incorrect');
        child.style.pointerEvents = 'none';
      }
      eventEmitter.emit('check-remove');
      eventEmitter.emit('continue');
    }
    eventEmitter.on('check-sentences', () => this.highlightIncorrectWords(allChildren));
  }

  highlightIncorrectWords(allChildren: HTMLCollection) {
    const currentChildren = allChildren;
    for (let j = 0; j < currentChildren.length; j++) {
      const partchild = currentChildren[j] as HTMLElement;
      partchild.classList.remove('incorrect');
      const word = wordCollection.split(' ')[j];
      if (partchild.textContent) {
        if (partchild.textContent !== word) {
          partchild.classList.add('incorrect');
        }
      }
    }
  }

  createPuzzlePiece(word:string, originalIndex: number) {
    const containerParam = {
      tag: 'div',
      classNames: [cssClasses.BLOCKPIECE],
      textContent: word,
    };
    const beforeParam = {
      tag: 'span',
      classNames: [cssClasses.SPANPIECEBEFORE],
      textContent: '',
    };
    const afterParam = {
      tag: 'span',
      classNames: [cssClasses.SPANPIECEAFTER],
      textContent: '',
    };
    const containerCreator = new ElementCreator(containerParam);
    const element = containerCreator.getElement();
    if (+originalIndex === 0) {
      const spanCreator = new ElementCreator(afterParam);
      element.append(spanCreator.getElement());
    } else if (+originalIndex === arrayAnswer.length - 1) {
      const spanCreator = new ElementCreator(beforeParam);
      element.append(spanCreator.getElement());
    } else {
      let spanCreator = new ElementCreator(beforeParam);
      element.append(spanCreator.getElement());
      spanCreator = new ElementCreator(afterParam);
      element.append(spanCreator.getElement());
    }
    return element;
  }
}
