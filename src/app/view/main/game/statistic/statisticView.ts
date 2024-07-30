/* eslint-disable import/no-cycle */
import './statisticView.css';
import View from '../../../view';
import { ElementParams, ElementCreator, WordCollection } from '../../../../utils/element-creator';
import EventEmitter from '../../../../utils/EventEmit';
import { getImgURL } from '../../../../utils/fileLoader';

const eventEmitter = EventEmitter.getInstance();
const cssClasses = {
  STATISTICWRAPPER: 'statistic-wrapper',
  STATISTIC: 'statistic-container',
  IMGCONTAINER: 'img-container',
  IMGINFO: 'img-info',
  LISTCONTAINER: 'list-container',
  DONTKNOW: 'dont-know-list-container',
  KNOW: 'know-list-container',
  HEADLIST: 'heading-list',
  RESULTLIST: 'result-list',
  RESULTITEM: 'result-list-item',
  BTNCONTINUE: 'continue-button',
  BUTTON: 'button',
};

export default class StatisticView extends View {
  private wordCollection: WordCollection;

  private round: number;

  constructor(wordCollection: WordCollection, round: number) {
    const params: ElementParams = {
      tag: 'section',
      classNames: [cssClasses.STATISTICWRAPPER],
      textContent: '',
    };
    super(params);
    this.wordCollection = wordCollection;
    this.round = round;
    this.configureView();
  }

  configureView() {
    const containerCreator = this.containerTagCreator('div', cssClasses.STATISTIC);
    this.fillStatisticContainer(containerCreator);
    this.elementCreator.addInnerElement(containerCreator.getElement());
  }

  containerTagCreator(tag:string, classNames: string) {
    const containerParam = {
      tag,
      classNames: [classNames],
      textContent: '',
    };
    return new ElementCreator(containerParam);
  }

  fillStatisticContainer(container: ElementCreator) {
    const currentContainer = container.getElement();
    const imgContainer = this.containerTagCreator('div', cssClasses.IMGCONTAINER);
    const roundWordCollection = this.wordCollection.rounds[this.round - 1].levelData;
    imgContainer.getElement().style.backgroundImage = `url(${getImgURL(roundWordCollection.cutSrc)})`;
    const imgInfo = this.containerTagCreator('div', cssClasses.IMGINFO);
    // eslint-disable-next-line max-len
    const descriptionText = `${this.wordCollection.rounds[this.round - 1].levelData.author} - ${this.wordCollection.rounds[this.round - 1].levelData.name}, ${this.wordCollection.rounds[this.round - 1].levelData.year}`;
    imgInfo.getElement().textContent = descriptionText;
    const listContainer = this.containerTagCreator('div', cssClasses.LISTCONTAINER);
    this.fillListContainer(listContainer);
    const BtnContinueParam = {
      tag: 'button',
      classNames: [cssClasses.BUTTON, cssClasses.BTNCONTINUE],
      textContent: 'continue',
    };
    const BtnContinueCreator = new ElementCreator(BtnContinueParam);
    BtnContinueCreator.setEventHandler('click', () => this.handleContinue());
    currentContainer.append(imgContainer.getElement(), imgInfo.getElement(), listContainer.getElement(), BtnContinueCreator.getElement());
  }

  fillListContainer(container: ElementCreator) {
    const knowListContainer = this.containerTagCreator('div', cssClasses.KNOW);
    const dontKnowListContainer = this.containerTagCreator('div', cssClasses.DONTKNOW);
    this.fillKnowListContainer(knowListContainer);
    this.fillDontKnowListContainer(dontKnowListContainer);
    container.addInnerElement(knowListContainer.getElement());
    container.addInnerElement(dontKnowListContainer.getElement());
  }

  fillKnowListContainer(container: ElementCreator) {
    const headList = this.containerTagCreator('h3', cssClasses.HEADLIST);
    headList.getElement().textContent = 'I know';
    const resultList = this.containerTagCreator('ul', cssClasses.RESULTLIST);
    container.getElement().append(headList.getElement(), resultList.getElement());
  }

  fillDontKnowListContainer(container: ElementCreator) {
    console.log(container);
  }

  private handleContinue() {
    eventEmitter.emit('StartNewRound');
    // const eventNames = eventEmitter.getAllListeners();
    // console.log(eventNames);
  }
}
