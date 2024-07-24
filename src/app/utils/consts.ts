const myKeySaveLocalStorage = 'formData';
// eslint-disable-next-line import/prefer-default-export
export { myKeySaveLocalStorage };
const object = {
  completeRounds: [[], [], [], [], [], []],
  lastRound: { level: 1, round: 1 },
  user: { name: 'Mate', surname: 'Narre' },
  swichBackgroundVisible: 'true',
  swichListenVisible: 'true',
  swichTranslatrVisible: 'false',
};
console.log(object);
// const key = 'testFor';
// localStorage.setItem(key, JSON.stringify(object));
// const row = localStorage.getItem(key);
// if (row) {
//   const allAbout = JSON.parse(row);
//   allAbout.user.name = 'Kirill';
//   localStorage.setItem(key, JSON.stringify(allAbout));
// }
