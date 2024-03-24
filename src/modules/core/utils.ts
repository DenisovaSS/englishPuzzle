export const createElement = (
  tag: string,
  classes: string[],
  parent?: HTMLElement | null,
  innerText = '',
): HTMLElement => {
  const element = document.createElement(tag);
  element.classList.add(...classes);
  if (innerText) element.innerText = innerText;
  if (parent != null) {
    parent.appendChild(element);
  }
  return element;
};

export const createInputElement = (
  id: string,
  type: string,
  parent?: HTMLElement | null,
  name?: string,
  value?: string,
): HTMLInputElement => {
  const element = document.createElement('input') as HTMLInputElement;
  element.id = id;
  element.type = type;
  if (name) element.name = name;
  if (value) element.value = value;
  if (parent != null) {
    parent.appendChild(element);
  }
  return element;
};
export const createLabelElement = (
  htmlFor: string,
  classes: string[],
  parent?: HTMLElement | null,
  labelText?: string,
): HTMLLabelElement => {
  const label = document.createElement('label') as HTMLLabelElement;
  label.htmlFor = htmlFor;
  if (labelText) label.textContent = labelText;
  label.classList.add(...classes);
  if (parent != null) {
    parent.appendChild(label);
  }
  return label;
};
