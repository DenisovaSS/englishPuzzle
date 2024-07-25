/* eslint-disable max-len */
import { WordCollection } from './element-creator';
import wordCollectionLevel1 from '../../data/wordCollectionLevel1.json';
import wordCollectionLevel2 from '../../data/wordCollectionLevel2.json';
import wordCollectionLevel3 from '../../data/wordCollectionLevel3.json';
import wordCollectionLevel4 from '../../data/wordCollectionLevel4.json';
import wordCollectionLevel5 from '../../data/wordCollectionLevel5.json';
import wordCollectionLevel6 from '../../data/wordCollectionLevel6.json';
import EventEmitter from './EventEmit';
import { myKeySaveLocalStorage } from './consts';

const eventEmitter = EventEmitter.getInstance();
const levels = 6;
const wordCollections: WordCollection[] = [wordCollectionLevel1, wordCollectionLevel2, wordCollectionLevel3, wordCollectionLevel4, wordCollectionLevel5, wordCollectionLevel6];
// default
let currentLevel = 1;
let currentRound = 1;
let currentEpisode = 0;
let wordCollection: WordCollection = wordCollections[currentLevel - 1];

const currentEpisodePart = wordCollection.rounds[currentRound - 1].words[currentEpisode];

function getRoundsCount(level:number):number {
  return level ? wordCollections[level - 1].roundsCount : 0;
}
let currentLevelRounds = getRoundsCount(currentLevel);
const isRoundComplete = (level:number, round:number) => {
  const dataStringStorage = localStorage.getItem(myKeySaveLocalStorage);
  if (dataStringStorage) {
    const objectData = JSON.parse(dataStringStorage).completeRounds;
    if (objectData) {
      if (objectData[level - 1].includes(round)
      ) {
        return true;
      }
    }
  }
  return false;
};
function getCurrentRounds(currentElement:number) {
  currentLevelRounds = getRoundsCount(currentElement);
  const selectList = document.getElementById('round') as HTMLSelectElement;
  while (selectList.firstElementChild) {
    selectList.firstElementChild.remove();
  }
  for (let i = 1; i < currentLevelRounds + 1; i++) {
    const option = document.createElement('option') as HTMLOptionElement;
    option.value = String(i);
    option.textContent = String(i);
    const isRoundCompleteCur = isRoundComplete(currentElement, i);
    if (isRoundCompleteCur) {
      option.classList.add('passed');
    }
    selectList.append(option);
  }
  currentLevel = currentElement;
  currentRound = 1;
  wordCollection = wordCollections[currentLevel - 1];
  currentEpisode = 0;
  eventEmitter.emit('changeLevel', wordCollection, currentRound);
}
function setCurrentRounds(round:number) {
  currentRound = round;
  currentEpisode = 0;
  // console.log(currentLevel, currentRound);
  eventEmitter.emit('changeRound', wordCollection, currentRound);
}
eventEmitter.on('getRounds', (currentElement) => getCurrentRounds(currentElement));
eventEmitter.on('setRounds', (round:number) => setCurrentRounds(round));

eventEmitter.on('nextEpisode', () => {
  currentEpisode += 1;
  eventEmitter.emit('setNextEpisode', currentEpisode);
});
function saveCompleteRoundInLocalStorage(level:number, round:number, countRoundsInLevel:number) {
  console.log(level, 'last');

  const dataStringStorage = localStorage.getItem(myKeySaveLocalStorage);
  if (dataStringStorage) {
    const objectData = JSON.parse(dataStringStorage);
    let lastwordCollection; let nextRoundStart; let lastLevel;
    if (round + 1 <= countRoundsInLevel) {
      lastwordCollection = wordCollections[level];
      nextRoundStart = round + 1;
      lastLevel = level;
    } else if (level + 1 < levels) {
      lastLevel = level + 1;
      lastwordCollection = wordCollections[lastLevel];
      nextRoundStart = 1;
    } else {
      lastLevel = 0;
      lastwordCollection = wordCollections[lastLevel];
      nextRoundStart = 1;
    }
    objectData.lastRound = { lastLevel, nextRoundStart, lastwordCollection };
    const completeRounds = objectData.completeRounds || [[], [], [], [], [], []];
    if (!completeRounds[level].includes(round)) { completeRounds[level].push(round); }
    objectData.completeRounds = completeRounds;
    localStorage.setItem(myKeySaveLocalStorage, JSON.stringify(objectData));
  }
}
eventEmitter.on('sendinfo', (wordCollectionCurent:WordCollection, roundCurrent:number) => {
  // console.log('work', wordCollectionCurent, roundCurrent);

  currentRound = roundCurrent + 1;
  const levelInEpisode = wordCollections.indexOf(wordCollectionCurent);
  console.log(wordCollections[0] === wordCollectionCurent);
  if (levelInEpisode !== -1) {
    const InEpisodeRounds = getRoundsCount(levelInEpisode + 1);
    saveCompleteRoundInLocalStorage(levelInEpisode, roundCurrent, InEpisodeRounds);
    // console.log(InEpisodeRounds);
    if (roundCurrent + 1 <= InEpisodeRounds) {
      currentRound = roundCurrent + 1;
      wordCollection = wordCollectionCurent;
      currentEpisode = 0;
      eventEmitter.emit('NextRoundHeader', levelInEpisode + 1, currentRound);
    } else {
      wordCollection = wordCollections[levelInEpisode + 1] || wordCollections[0];
      currentRound = 1;
      currentEpisode = 0;
      eventEmitter.emit('NextRoundHeader', levelInEpisode + 2, currentRound);
    }

    eventEmitter.emit('NextRound', wordCollection, currentRound);
  } else {
    console.log('WordCollection not found in the list');
  }
  // throw new Error('WordCollection not found in the list.');
});
const LevelInfo = {
  levels, currentLevel, currentLevelRounds, currentRound, currentEpisodePart, wordCollection, currentEpisode, wordCollections,
};
export default LevelInfo;
