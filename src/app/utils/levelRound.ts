/* eslint-disable max-len */
import { WordCollection } from './element-creator';
import wordCollectionLevel1 from '../../data/wordCollectionLevel1.json';
import wordCollectionLevel2 from '../../data/wordCollectionLevel2.json';
import wordCollectionLevel3 from '../../data/wordCollectionLevel3.json';
import wordCollectionLevel4 from '../../data/wordCollectionLevel4.json';
import wordCollectionLevel5 from '../../data/wordCollectionLevel5.json';
import wordCollectionLevel6 from '../../data/wordCollectionLevel6.json';
import EventEmitter from './EventEmit';

const eventEmitter = EventEmitter.getInstance();
const levels = 6;
const wordCollections: WordCollection[] = [wordCollectionLevel1, wordCollectionLevel2, wordCollectionLevel3, wordCollectionLevel4, wordCollectionLevel5, wordCollectionLevel6];
// default
let currentLevel = 1;
let currentRound = 2;
const currentEpisode = 0;
let wordCollection: WordCollection = wordCollections[currentLevel - 1];

const currentEpisodePart = wordCollection.rounds[currentRound - 1].words[currentEpisode];
// console.log(currentEpisodePart);
function getRoundsCount(level:number):number {
  return level ? wordCollections[level - 1].roundsCount : 0;
}
let currentLevelRounds = getRoundsCount(currentLevel);
function getCurrentRounds(currentElement:number) {
  currentLevelRounds = getRoundsCount(currentElement);
  const selectList = document.getElementById('round') as HTMLSelectElement;
  // console.log(currentLevelRounds);
  while (selectList.firstElementChild) {
    selectList.firstElementChild.remove();
  }
  for (let i = 1; i < currentLevelRounds + 1; i++) {
    const option = document.createElement('option') as HTMLOptionElement;
    option.value = String(i);
    option.textContent = String(i);
    selectList.append(option);
  }
  currentLevel = currentElement;
  currentRound = 1;
  wordCollection = wordCollections[currentLevel - 1];
  // console.log(currentLevel, currentRound);
  eventEmitter.emit('changeLevel', wordCollection, currentRound);
}
function setCurrentRounds(round:number) {
  currentRound = round;
  // console.log(currentLevel, currentRound);
  eventEmitter.emit('changeRound', wordCollection, currentRound);
}
eventEmitter.on('getRounds', (currentElement) => getCurrentRounds(currentElement));
eventEmitter.on('setRounds', (round:number) => setCurrentRounds(round));

const LevelInfo = {
  levels, currentLevel, currentLevelRounds, currentRound, currentEpisodePart, wordCollection, currentEpisode,
};
export default LevelInfo;
