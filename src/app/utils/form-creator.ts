import { InputCreator, InputParams } from './input-element-creator';
import { myKeySaveLocalStorage } from './consts';

export interface FormParams {
  inputs: InputParams[];
  buttonText: string;
  onSubmit: (event: Event) => void;
}

export class FormCreator {
  private formElement: HTMLFormElement;

  constructor(params: FormParams) {
    this.formElement = document.createElement('form') as HTMLFormElement;
    this.createInputs(params.inputs);
    this.createButton(params.buttonText);
    this.setFormSubmitListener(params.onSubmit);
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

  private setFormSubmitListener(submitHandler: (event: Event) => void) {
    this.formElement.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      const errors = this.formElement.querySelectorAll('.error');
      errors.forEach((err) => err.remove());
      const inputsValid = this.validateInputs();
      if (inputsValid) {
        this.saveFormDataToLocalStorage();
        submitHandler(event);
      } else {
        console.log('Form validation failed');
      }
    });
  }

  validateInputs(): boolean {
    let allInputsValid = true;

    this.formElement.querySelectorAll('input').forEach((inputElement) => {
      const messages: string[] = [];
      if (inputElement.value === '' || inputElement.value == null) {
        messages.push('Name cannot be blank');
      } else {
        const re = /^[A-Za-z-]+$/;
        if (!re.test(inputElement.value)) {
          messages.push('Please use English alphabet and the hyphen symbol');
        }
        const firstLetter: string = inputElement.value.charAt(0);
        if (firstLetter !== firstLetter.toUpperCase()) {
          messages.push('First letter is in uppercase');
        }
        if (inputElement.name === 'firstName') {
          if (inputElement.value.length < 3) {
            messages.push('Please set a minimum length of 3 characters');
          }
        }
        if (inputElement.name === 'lastName') {
          if (inputElement.value.length < 4) {
            messages.push('Please set a minimum length of 4 characters');
          }
        }
      }
      if (messages.length > 0) {
        allInputsValid = false;
        this.displayValidationError(inputElement, messages);
      }
    });

    return allInputsValid;
  }

  displayValidationError(input: HTMLInputElement, messages: string[]) {
    const error: HTMLElement = document.createElement('div');
    error.classList.add('error');
    input.after(error);
    error.innerHTML = messages.join(', ');
  }

  saveFormDataToLocalStorage() {
    const user: { [key: string]: string } = {};
    this.formElement.querySelectorAll('input').forEach((inputElement) => {
      user[inputElement.name] = (inputElement as HTMLInputElement).value;
    });
    // const user = { formData };
    const buttonsHint = {
      swichBackgroundVisible: true,
      swichListenVisible: true,
      swichTranslateVisible: true,
    };
    const combinedData = {
      user,
      buttonsHint,
    };
    localStorage.setItem(myKeySaveLocalStorage, JSON.stringify(combinedData));
  }

  getElement(): HTMLFormElement {
    return this.formElement;
  }
}
