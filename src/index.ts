import './index.html';
import './style.css';
import cup from './img/coffee-cup.svg';
import { myName, mult } from './modules/culc';

const imgElem = document.querySelector('.img');
const img = new Image();
img.src = cup;
img.width = 200;
if (imgElem) {
  imgElem.append(img);
}
console.log(mult(4, 6));
console.log(mult(10, 6));
console.log('my favoryte');

myName('My qeen');
function hell(name: string) {
  return console.log('I am angry!!', name);
}
hell('Sveta');
