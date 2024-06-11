/* eslint-disable max-len */
import './headerGameView.css';
import View from '../../../view';
import {
  ElementParams,
  ElementCreator,
} from '../../../../utils/element-creator';
import MainView from '../../main';
import LoginView from '../../login/login_view';
import LevelInfo from '../../../../utils/levelRound';
import EventEmitter from '../../../../utils/EventEmit';

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
const COUNTLEVEL = LevelInfo.levels;
const wordCollectionRounds = LevelInfo.currentLevelRounds;
const currentEpisodePartNow = LevelInfo.currentEpisodePart;
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
    this.fillContainerHints(containerHintsCreator);
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
    settingLevel.addInnerElement(this.createSelect('level', COUNTLEVEL, true));
    settingLevel.addInnerElement(this.createSelect('round', wordCollectionRounds, false));
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

  createSelect(id:string, count:number, attachEvent: boolean = true) {
    const selectContainer = document.createElement('div');
    selectContainer.classList.add(cssClasses.SELECTCONTAINER);

    const label = document.createElement('label');
    label.textContent = id;
    label.classList.add(cssClasses.SELECTLABEL);
    label.htmlFor = id;

    const select = document.createElement('select');
    select.classList.add(cssClasses.SELECTLIST);
    select.id = id;

    if (attachEvent) {
      select.addEventListener('change', (e) => this.createRoundsForLevel(e));
    }

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
    buttonText.setEventHandler('click', (e) => this.clickButtonText(e));
    currentContainer.append(buttonAudio.getElement(), buttonImg.getElement(), buttonText.getElement());
  }

  fillContainerHints(container: ElementCreator) {
    const currentContainer = container.getElement();
    const buttonPlay = this.containerCreator('button', cssClasses.BUTTONPLAYAUDIO);
    const img = this.renderSVG();
    buttonPlay.getElement().append(img);
    const textHint = document.createElement('div');
    textHint.classList.add(cssClasses.TEXTHINT);
    textHint.textContent = currentEpisodePartNow.textExampleTranslate;
    currentContainer.append(buttonPlay.getElement(), textHint);
  }

  renderSVG() {
    const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const iconPath = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path',
    );
    const iconPathNext = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path',
    );
    iconSvg.setAttribute('fill', 'none');
    iconSvg.setAttribute('viewBox', '0 0 24 24');
    iconSvg.setAttribute('stroke', '#18193F');
    iconSvg.classList.add('post-icon');

    iconPath.setAttribute(
      'd',
      'M13.888 9.935C14.963 10.812 15.5 11.25 15.5 12s-.537 1.188-1.612 2.065c-.297.242-.591.47-.862.66-.237.167-.506.339-.784.508-1.073.652-1.609.978-2.09.617-.48-.36-.524-1.116-.612-2.628-.024-.427-.04-.846-.04-1.222s.016-.795.04-1.222c.088-1.512.132-2.267.612-2.628.481-.361 1.018-.035 2.09.617.278.169.547.341.784.508.27.19.565.418.862.66Z',
    );
    iconPath.setAttribute('stroke-width', '1.5');
    iconPathNext.setAttribute(
      'd',
      'M7 3.338A9.954 9.954 0 0 1 12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12c0-1.821.487-3.53 1.338-5',
    );
    iconPathNext.setAttribute('stroke-linecap', 'round');
    iconPathNext.setAttribute('stroke-width', '1.5');
    iconSvg.appendChild(iconPath);
    iconSvg.appendChild(iconPathNext);

    return iconSvg;
  }

  clickButtonText(e:Event) {
    const currentTarget = e.currentTarget as HTMLElement;
    const textHint = currentTarget.parentElement?.parentElement?.nextElementSibling?.lastElementChild;
    currentTarget.classList.toggle('click');
    textHint?.classList.toggle('hidden');
  }

  createRoundsForLevel(e: Event) {
    const currentTarget = e.currentTarget as HTMLOptionElement;
    const eventEmitter = EventEmitter.getInstance();
    eventEmitter.emit('changeRounds', currentTarget.value);
  }
}
