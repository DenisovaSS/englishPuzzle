import './headerGameView.css';
import View from '../../../view';
import {
  ElementParams,
  ElementCreator,
} from '../../../../utils/element-creator';
import MainView from '../../main';
import LoginView from '../../login/login_view';
import wordCollectionLevel1 from '../../../../../data/wordCollectionLevel1.json';

const cssClasses = {
  HEADERG: 'header-game',
  BLOCKSETTING: 'setting-block',
  SETTINGLEVEL: 'setting-level',
  SETINGHINTS: 'setting-hints',
  BLOCKHINTS: 'hints-block',
  TEXTHINT: 'text-hint',
  BUTTONAUDIO: 'audio-hint-button',
  BUTTONPLAYAUDIO: 'audio-hint-play-button',
  BUTTONIMG: 'image-button',
  BUTTONTEXT: 'text-hint-button',
  BUTTONLOGOOUT: 'logout-button',
  BUTTON: 'button',
  SELECTCONTAINER: 'select_container',
  SELECTLABEL: 'select__label',
  SELECTLIST: 'select__list',
};
const COUNTLEVEL = 6;
const wordCollectionRounds = wordCollectionLevel1.rounds.length;

export default class HeaderGameView extends View {
  constructor(public mainView: MainView) {
    const params: ElementParams = {
      tag: 'div',
      classNames: [cssClasses.HEADERG],
      textContent: '',
    };
    super(params);

    this.configureView();
  }

  configureView() {
    const containerSettingCreator = this.containerCreator('div', cssClasses.BLOCKSETTING);
    this.fillContainerSetting(containerSettingCreator);
    this.elementCreator.addInnerElement(containerSettingCreator.getElement());
    const containerHintsCreator = this.containerCreator('div', cssClasses.BLOCKHINTS);
    // this.fillContainerHints(containerHintsCreator);
    this.elementCreator.addInnerElement(containerHintsCreator.getElement());
  }

  containerCreator(tag:string, classNames: string) {
    const containerParam = {
      tag,
      classNames: [classNames],
      textContent: '',
    };
    return new ElementCreator(containerParam);
  }

  fillContainerSetting(container: ElementCreator) {
    const currentContainer = container.getElement();
    const settingLevel = this.containerCreator('div', cssClasses.SETTINGLEVEL);
    settingLevel.addInnerElement(this.createSelect('level', COUNTLEVEL));
    settingLevel.addInnerElement(this.createSelect('round', wordCollectionRounds));
    const BtnLogOutParam = {
      tag: 'button',
      classNames: [cssClasses.BUTTON, cssClasses.BUTTONLOGOOUT],
      textContent: 'Logout',
    };
    const BtnLogOutCreator = new ElementCreator(BtnLogOutParam);
    BtnLogOutCreator.setEventHandler('click', () => {
      this.mainView.setContent(new LoginView(this.mainView));
    });
    const settingHints = this.containerCreator('div', cssClasses.SETINGHINTS);
    this.fillSettingHints(settingHints);
    currentContainer.append(settingLevel.getElement(), BtnLogOutCreator.getElement(), settingHints.getElement());
  }

  createSelect(id:string, count:number) {
    const selectContainer = document.createElement('div');
    selectContainer.classList.add(cssClasses.SELECTCONTAINER);
    const label = document.createElement('label');
    label.textContent = id;
    label.classList.add(cssClasses.SELECTLABEL);
    label.htmlFor = id;
    const select = document.createElement('select');
    select.classList.add(cssClasses.SELECTLIST);
    select.id = id;
    for (let i = 1; i < count + 1; i++) {
      const option = document.createElement('option') as HTMLOptionElement;
      option.value = String(i);
      option.textContent = String(i);
      select.append(option);
    }
    selectContainer.append(label, select);
    return selectContainer;
  }

  fillSettingHints(container: ElementCreator) {
    const currentContainer = container.getElement();
    const buttonAudio = this.containerCreator('button', cssClasses.BUTTONAUDIO);
    const buttonImg = this.containerCreator('button', cssClasses.BUTTONIMG);
    const buttonText = this.containerCreator('button', cssClasses.BUTTONTEXT);
    currentContainer.append(buttonAudio.getElement(), buttonImg.getElement(), buttonText.getElement());
  }
}
