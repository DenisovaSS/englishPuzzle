/* eslint-disable max-len */
import './headerGameView.css';
import View from '../../../view';
import {
  ElementParams,
  ElementCreator,
} from '../../../../utils/element-creator';
import MainView from '../../main';
// import LoginView from '../../login/login_view';
import LevelInfo from '../../../../utils/levelRound';
import EventEmitter from '../../../../utils/EventEmit';
import { getAudioFileURL } from '../../../../utils/fileLoader';
import { myKeySaveLocalStorage } from '../../../../utils/consts';
import SoundButton from '../../../../utils/createSoundButton';

// import audioFile from '../../../../../files/01_0001_example.mp3';

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
const eventEmitter = EventEmitter.getInstance();
const COUNTLEVEL = LevelInfo.levels;
const wordCollectionRounds = LevelInfo.currentLevelRounds;
console.log(wordCollectionRounds);

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

    // Add event listener for setAudio here
    // const eventEmitter = EventEmitter.getInstance();
    eventEmitter.on('andRound', () => {
      containerHintsCreator.getElement().classList.add('hide');
    });
    eventEmitter.on('setAudio', (audioExample: string) => {
      const audioCurent = document.querySelector('audio');
      if (audioCurent) { audioCurent.remove(); }
      const audio = document.createElement('audio') as HTMLAudioElement;
      // audio.autoplay = true;
      const source = document.createElement('source');
      source.src = getAudioFileURL(audioExample);
      audio.append(source);
      this.elementCreator.addInnerElement(audio);
      // audio.play();
    });
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
    // const eventEmitter = EventEmitter.getInstance();
    const currentContainer = container.getElement();
    const settingLevel = this.containerCreator('div', cssClasses.SETTINGLEVEL);
    const levels = this.createSelectLevel('level', COUNTLEVEL);
    const curentLevel = LevelInfo.currentLevel;
    const rounds = this.createSelectRound('round', wordCollectionRounds, curentLevel);
    eventEmitter.on('NextRoundHeader', (currentLevel:number, currentRound:number, contRounds :number) => {
      console.log(currentLevel, 'whaen start');
      const visible = this.elementCreator.getElement().children[1].classList.contains('hide');
      if (visible) { this.elementCreator.getElement().children[1].classList.remove('hide'); }
      const oldRounds = settingLevel.getElement().querySelector('.round');
      if (oldRounds) { oldRounds.remove(); }
      const roundsStart = this.createSelectRound('round', contRounds, currentLevel);
      settingLevel.addInnerElement(roundsStart);
      const selectElementLevel = levels.querySelector('select');
      const selectElementRound = roundsStart.querySelector('select');
      if (selectElementLevel && selectElementRound) {
        selectElementLevel.value = String(currentLevel + 1);
        selectElementRound.value = String(currentRound);
      } else {
        console.log('please check rounds or levels');
      }
    });
    // console.log(wordCollectionRounds);

    settingLevel.addInnerElement(levels);
    settingLevel.addInnerElement(rounds);

    const BtnLogOutParam = {
      tag: 'button',
      classNames: [cssClasses.BUTTON, cssClasses.BUTTONLOGOOUT],
      textContent: 'Logout',
    };
    const BtnLogOutCreator = new ElementCreator(BtnLogOutParam);
    BtnLogOutCreator.setEventHandler('click', () => {
      // const eventEmitter = EventEmitter.getInstance();
      eventEmitter.emit('logout');
      // this.mainView.setContent(new LoginView(this.mainView));
    });
    const settingHints = this.containerCreator('div', cssClasses.SETINGHINTS);
    this.fillSettingHints(settingHints);
    currentContainer.append(settingLevel.getElement(), BtnLogOutCreator.getElement(), settingHints.getElement());
  }

  createSelectLevel(id:string, count:number) {
    const selectContainer = document.createElement('div');
    selectContainer.classList.add(cssClasses.SELECTCONTAINER);
    selectContainer.classList.add(id);
    const label = document.createElement('label');
    label.textContent = id;
    label.classList.add(cssClasses.SELECTLABEL);
    label.htmlFor = id;

    const select = document.createElement('select');
    select.classList.add(cssClasses.SELECTLIST);
    select.id = id;

    select.addEventListener('change', (e) => this.createRoundsForLevel(e));
    for (let i = 1; i < count + 1; i++) {
      const option = document.createElement('option') as HTMLOptionElement;
      option.value = String(i);
      option.textContent = String(i);
      select.append(option);
    }
    selectContainer.append(label, select);

    return selectContainer;
  }

  createSelectRound(id:string, count:number, level: number) {
    const selectContainer = document.createElement('div');
    selectContainer.classList.add(cssClasses.SELECTCONTAINER);
    selectContainer.classList.add(id);
    const label = document.createElement('label');
    label.textContent = id;
    label.classList.add(cssClasses.SELECTLABEL);
    label.htmlFor = id;

    const select = document.createElement('select');
    select.classList.add(cssClasses.SELECTLIST);
    select.id = id;
    select.addEventListener('change', (e) => this.setRound(e));
    for (let i = 1; i < count + 1; i++) {
      const option = document.createElement('option') as HTMLOptionElement;
      option.value = String(i);
      option.textContent = String(i);
      const isRoundComplete = (checkLevel:number, round:number) => {
        const dataStringStorage = localStorage.getItem(myKeySaveLocalStorage);
        if (dataStringStorage) {
          const objectData = JSON.parse(dataStringStorage).completeRounds;
          if (objectData) {
            if (objectData[checkLevel].includes(round)
            ) {
              return true;
            }
          }
        }
        return false;
      };
      const isRoundCompleteCur = isRoundComplete(level, i);
      if (isRoundCompleteCur) {
        option.classList.add('passed');
      }
      select.append(option);
    }
    selectContainer.append(label, select);

    return selectContainer;
  }

  fillSettingHints(container: ElementCreator) {
    const currentContainer = container.getElement();
    const buttonAudio = this.containerCreator('button', cssClasses.BUTTONAUDIO);
    buttonAudio.setEventHandler('click', (e) => this.clickButtonAudio(e));
    const buttonImg = this.containerCreator('button', cssClasses.BUTTONIMG);
    buttonImg.setEventHandler('click', (e) => this.clickButtonImg(e));
    const buttonText = this.containerCreator('button', cssClasses.BUTTONTEXT);
    buttonText.setEventHandler('click', (e) => this.clickButtonText(e));
    currentContainer.append(buttonAudio.getElement(), buttonImg.getElement(), buttonText.getElement());
  }

  fillContainerHints(container: ElementCreator) {
    const currentContainer = container.getElement();
    const { buttonPlay } = SoundButton;
    buttonPlay.setEventHandler('click', (e) => this.clickButtonPlay(e));
    const textHint = document.createElement('div');
    textHint.classList.add(cssClasses.TEXTHINT);
    // const eventEmitter = EventEmitter.getInstance();
    eventEmitter.on('setTranslate', (textExampleTranslate: string) => {
      textHint.textContent = textExampleTranslate;
    });
    textHint.textContent = currentEpisodePartNow.textExampleTranslate;
    currentContainer.append(buttonPlay.getElement(), textHint);
  }

  createRoundsForLevel(e: Event) {
    const currentTarget = e.currentTarget as HTMLOptionElement;
    // const eventEmitter = EventEmitter.getInstance();
    eventEmitter.emit('getRounds', +currentTarget.value - 1);
  }

  setRound(e: Event) {
    const currentTarget = e.currentTarget as HTMLOptionElement;
    // const eventEmitter = EventEmitter.getInstance();
    eventEmitter.emit('setRounds', +currentTarget.value);
  }

  clickButtonImg(e:Event) {
    const currentTarget = e.currentTarget as HTMLElement;
    currentTarget.classList.toggle('click');
    const bodyElement = document.body;
    bodyElement.classList.toggle('back-off');
  }

  clickButtonText(e:Event) {
    const currentTarget = e.currentTarget as HTMLElement;
    const textHint = currentTarget.parentElement?.parentElement?.nextElementSibling?.lastElementChild;
    currentTarget.classList.toggle('click');
    textHint?.classList.toggle('hidden');
  }

  clickButtonAudio(e:Event) {
    const currentTarget = e.currentTarget as HTMLElement;
    const buttonAudioPlay = currentTarget.parentElement?.parentElement?.nextElementSibling?.firstElementChild;
    currentTarget.classList.toggle('click');
    buttonAudioPlay?.classList.toggle('hidden');
  }

  clickButtonPlay(e:Event) {
    const currentTarget = e.currentTarget as HTMLElement;
    // console.log(document.querySelectorAll('audio'));
    const audio = document.querySelector('audio');
    if (audio) {
      audio.autoplay = true;
      audio.play();
      audio.addEventListener('play', () => {
        currentTarget.classList.add('play');
      });
      audio.addEventListener('ended', () => {
        currentTarget.classList.remove('play');
        // audio.remove();
      });
    }
  }
}
