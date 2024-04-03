const mult = (a: number, b: number) => a + b;
function myName(name: string) {
  const point = document.querySelector('p');
  const namePeople = document.createElement('div');
  namePeople.innerText = `Hello ${name}`;
  if (point) {
    point.append(namePeople);
  }
}
export { myName, mult };
