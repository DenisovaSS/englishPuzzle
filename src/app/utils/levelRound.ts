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
let currentLevel = 0;
let currentRound = 1;
let currentEpisode = 0;
let wordCollection: WordCollection = wordCollections[currentLevel];

const currentEpisodePart = wordCollection.rounds[currentRound - 1].words[currentEpisode];

function getRoundsCount(level:number):number {
  // console.log(level);
  return level + 1 ? wordCollections[level].roundsCount : 0;
}
let currentLevelRounds = getRoundsCount(currentLevel);
const isRoundComplete = (level:number, round:number) => {
  const dataStringStorage = localStorage.getItem(myKeySaveLocalStorage);
  if (dataStringStorage) {
    const objectData = JSON.parse(dataStringStorage).completeRounds;
    if (objectData) {
      if (objectData[level].includes(round)
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
  wordCollection = wordCollections[currentLevel];
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
  const dataStringStorage = localStorage.getItem(myKeySaveLocalStorage);
  if (dataStringStorage) {
    const objectData = JSON.parse(dataStringStorage);
    let nextRoundStart; let lastLevel;
    if (round + 1 <= countRoundsInLevel) {
      nextRoundStart = round + 1;
      lastLevel = level;
    } else if (level + 1 < levels) {
      lastLevel = level + 1;
      nextRoundStart = 1;
    } else {
      lastLevel = 0;
      nextRoundStart = 1;
    }
    objectData.lastRound = { lastLevel, nextRoundStart };
    const completeRounds = objectData.completeRounds || [[], [], [], [], [], []];
    if (!completeRounds[level].includes(round)) { completeRounds[level].push(round); }
    objectData.completeRounds = completeRounds;
    localStorage.setItem(myKeySaveLocalStorage, JSON.stringify(objectData));
  }
}
eventEmitter.on('saveLastCompletedRound', (lastWordCollection:WordCollection, lastRound:number) => {
  const levelInEpisode = wordCollections.indexOf(lastWordCollection);
  if (levelInEpisode !== -1) {
    const InEpisodeRounds = getRoundsCount(levelInEpisode);
    saveCompleteRoundInLocalStorage(levelInEpisode, lastRound, InEpisodeRounds);
  } else {
    console.log('WordCollection not found in the list');
  }
});
eventEmitter.on('sendinfo', (wordCollectionCurent:WordCollection, roundCurrent:number) => {
  currentRound = roundCurrent + 1;
  let levelInEpisode = wordCollections.indexOf(wordCollectionCurent);
  console.log(levelInEpisode);
  if (levelInEpisode !== -1) {
    let InEpisodeRounds = getRoundsCount(levelInEpisode);
    if (roundCurrent + 1 <= InEpisodeRounds) {
      currentRound = roundCurrent + 1;
      wordCollection = wordCollectionCurent;
      currentEpisode = 0;

      // eventEmitter.emit('NextRoundHeader', levelInEpisode, currentRound, InEpisodeRounds);
    } else {
      wordCollection = wordCollections[levelInEpisode + 1] || wordCollections[0];
      currentRound = 1;
      currentEpisode = 0;
      if (levelInEpisode + 1 < levels) {
        InEpisodeRounds = getRoundsCount(levelInEpisode + 1);
        levelInEpisode += 1;
      } else {
        InEpisodeRounds = getRoundsCount(0);
        levelInEpisode = 0;
      }
    }
    console.log(levelInEpisode);
    eventEmitter.emit('NextRoundHeader', levelInEpisode, currentRound, InEpisodeRounds);
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
