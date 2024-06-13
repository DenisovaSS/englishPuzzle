/* eslint-disable max-len */
import wordCollectionLevel1 from '../../data/wordCollectionLevel1.json';
import wordCollectionLevel2 from '../../data/wordCollectionLevel2.json';
import wordCollectionLevel3 from '../../data/wordCollectionLevel3.json';
import wordCollectionLevel4 from '../../data/wordCollectionLevel4.json';
import wordCollectionLevel5 from '../../data/wordCollectionLevel5.json';
import wordCollectionLevel6 from '../../data/wordCollectionLevel6.json';
import EventEmitter from './EventEmit';

const eventEmitter = EventEmitter.getInstance();
const levels = 6;
let currentLevel = 1;
const wordCollections = [wordCollectionLevel1, wordCollectionLevel2, wordCollectionLevel3, wordCollectionLevel4, wordCollectionLevel5, wordCollectionLevel6];
const wordCollection = wordCollections[currentLevel - 1];
const currentRound = 1;
const currentEpisode = 3;
const currentEpisodePart = wordCollection.rounds[currentRound - 1].words[currentEpisode];
function getRoundsCount(level:number):number {
  return level ? wordCollections[level - 1].roundsCount : 0;
}
let currentLevelRounds = getRoundsCount(currentLevel);
function changeCurentlevel(curentElement:number) {
  currentLevel = curentElement;
  currentLevelRounds = getRoundsCount(currentLevel);
  const selectList = document.getElementById('round') as HTMLSelectElement;
  console.log(currentLevelRounds);
  while (selectList.firstElementChild) {
    selectList.firstElementChild.remove();
  }

  for (let i = 1; i < currentLevelRounds + 1; i++) {
    const option = document.createElement('option') as HTMLOptionElement;
    option.value = String(i);
    option.textContent = String(i);
    selectList.append(option);
  }
}
eventEmitter.on('changeRounds', (curentElement) => changeCurentlevel(curentElement));

const LevelInfo = {
  levels, currentLevel, currentLevelRounds, currentRound, currentEpisodePart, wordCollection,
};
export default LevelInfo;
