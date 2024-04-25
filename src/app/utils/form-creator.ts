import { InputCreator, InputParams } from './input-element-creator';

export interface FormParams {
  inputs: InputParams[];
  buttonText: string;
}

export class FormCreator {
  private formElement: HTMLFormElement;

  constructor(params: FormParams) {
    this.formElement = document.createElement('form') as HTMLFormElement;
    this.createInputs(params.inputs);
    this.createButton(params.buttonText);
  }

  private createInputs(inputs: InputParams[]) {
    inputs.forEach((inputParams) => {
      this.createLabel(inputParams.inputAttributes.id, inputParams.textContent);
      const inputCreator = new InputCreator(inputParams);
      const inputElement = inputCreator.getElement();

      this.formElement.appendChild(inputElement);

      // Create and append label associated with the input
    });
  }

  private createLabel(forId: string, labelText: string) {
    const labelElement = document.createElement('label') as HTMLLabelElement;
    labelElement.htmlFor = forId;
    labelElement.textContent = labelText;

    this.formElement.appendChild(labelElement);
  }

  private createButton(buttonText: string) {
    const buttonElement = document.createElement('button') as HTMLButtonElement;
    buttonElement.type = 'submit';
    buttonElement.textContent = buttonText;

    this.formElement.appendChild(buttonElement);
  }

  getElement(): HTMLFormElement {
    return this.formElement;
  }
}
