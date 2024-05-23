import './resultGameView.css';
import View from '../../../view';
import {
  ElementParams,
  ElementCreator,
} from '../../../../utils/element-creator';
import EventEmitter from '../../../../utils/EventEmit';
import wordCollectionLevel1 from '../../../../../data/wordCollectionLevel1.json';

const wordCollection = wordCollectionLevel1.rounds[0].words[7].textExample;
const cssClasses = {
  RESULT: 'game-result-container',
  PARTRESULT: 'game-result-container-part',
  PARTPIECE: 'game-result-container-part-piece',
  BLOCKPIECE: 'item-piece',
};
const countWordSentanc: number = 9;
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
    const containerParam = {
      tag: 'div',
      classNames: [cssClasses.PARTRESULT],
      textContent: '',
    };
    const containerCreator = new ElementCreator(containerParam);
    this.elementCreator.addInnerElement(containerCreator.getElement());
    const containerPieceParam = {
      tag: 'div',
      classNames: [cssClasses.PARTPIECE],
      textContent: '',
    };
    function dragOver(e: Event) {
      // console.log('Event: ', 'dragover');
      e.preventDefault();
      // const target = e.target as HTMLElement;
      // while (target.firstChild) {
      //   target.removeChild(target.firstChild);
      // }
    }
    function dragDrop(e: DragEvent) {
      const currentContainerCreator = containerCreator.getElement();
      const allChildren = currentContainerCreator.children;
      console.log(allChildren);
      const target = e.target as HTMLElement;

      const article = document.querySelector(
        // eslint-disable-next-line @typescript-eslint/comma-dangle
        `[data-index='${e.dataTransfer?.getData('text')}']`
      );
      if (article) {
        if (target.classList.contains(cssClasses.PARTPIECE)) {
          target.appendChild(article);
        }
        if (target.classList.contains(cssClasses.BLOCKPIECE)) {
          const oldParent = article.parentElement;
          target.parentElement?.appendChild(article);
          oldParent?.appendChild(target);
        }
      }
    }
    for (let i = 0; i < countWordSentanc; i++) {
      const containerPieceCreator = new ElementCreator(containerPieceParam);
      const currentPieceCreator = containerPieceCreator.getElement();
      currentPieceCreator.addEventListener('dragover', dragOver);
      currentPieceCreator.addEventListener('drop', dragDrop);
      // containerPieceCreator.setId(String(i));
      containerCreator.addInnerElement(currentPieceCreator);
    }
    return containerCreator;
  }

  fillField(containerCreator: ElementCreator) {
    const eventEmitter = EventEmitter.getInstance();
    let countChild = 0;
    const currentContainerCreator = containerCreator.getElement();
    const allChildren = currentContainerCreator.children;
    eventEmitter.on('autoCompleteSentence', () => {
      for (let i = 0; i < allChildren.length; i++) {
        const child = allChildren[i] as HTMLElement;
        while (child.firstElementChild) {
          eventEmitter.emit('pushInPiece', child.firstElementChild);
          child.firstElementChild.remove();
        }
        countChild--;
      }
      const arrayAnswer = wordCollection.split(' ');
      for (let j = 0; j < arrayAnswer.length; j++) {
        const word = arrayAnswer[j];
        const newElement = document.createElement('div');
        newElement.classList.add(cssClasses.BLOCKPIECE);
        newElement.textContent = word;

        allChildren[j].append(newElement);
      }
      eventEmitter.emit('clearPeaceContainer');
      eventEmitter.emit('check-remove');
      eventEmitter.emit('continue');
    });
    const pieceEventListener = (clickedElement: HTMLElement) => {
      const newElement = document.createElement('div');
      newElement.classList.add(cssClasses.BLOCKPIECE);
      newElement.textContent = clickedElement.textContent;
      newElement.draggable = true;
      newElement.dataset.index = clickedElement.dataset.index;
      // console.log(allChildren);
      let childIndex = 0;
      newElement.addEventListener('click', (event) => {
        const clickedPiece = event.target as HTMLElement;
        for (let i = 0; i < allChildren.length; i++) {
          const child = allChildren[i] as HTMLElement;
          // child.classList.remove('incorrect');
          if (child.contains(clickedPiece)) {
            eventEmitter.emit('pushInPiece', clickedPiece);
            child.removeChild(clickedPiece);
            countChild--;
            break;
          }
        }
      });
      function dragStart(event: DragEvent) {
        const target = event.target as HTMLElement;
        if (target && target.dataset.index) {
          event.dataTransfer?.setData('text', target.dataset.index);
        } else {
          console.error('Drag target does not have an id');
        }
      }
      newElement.addEventListener('dragstart', dragStart);
      while (
        // eslint-disable-next-line operator-linebreak
        childIndex < allChildren.length &&
        allChildren[childIndex].childElementCount > 0
      ) {
        childIndex++;
      }
      if (childIndex < allChildren.length) {
        allChildren[childIndex].append(newElement);
        countChild++;
      }
      if (countWordSentanc === countChild) {
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
            child.style.pointerEvents = 'none';
          }
          eventEmitter.emit('check-remove');
          eventEmitter.emit('continue');
        }
        eventEmitter.on('check-sentences', () => {
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
        });
      }
    };
    eventEmitter.on('piece', pieceEventListener);
  }
}
