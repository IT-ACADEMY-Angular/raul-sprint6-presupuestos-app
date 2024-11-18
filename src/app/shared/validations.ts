import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  //validar solo numeros y numeros positivos
  static onlyNumbers(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = /^[1-9][0-9]*$/.test(control.value);
      return valid ? null : { onlyNumbers: true };
    };
  }

  //validar que siempre haya 1 valor
  static minimumValue(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid = control.value >= min;
      return isValid ? null : { minValue: { requiredValue: min, actualValue: control.value } };
    };
  }

  //validar que solo entren numeros por teclado [he añadido excepciones con las teclas básicas]
  static preventNonNumericKey(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  //limpiar la entrada de cualquier carácter no numérico y forzar un valor mínimo de 1 si pongo 0
  static sanitizeInput(input: HTMLInputElement) {
    input.value = input.value.replace(/[^0-9]/g, '');
    if (input.value === '0') {
      input.value = '1';
    }
  }

  //validar que solo se pongan letras
  static onlyLetters(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(control.value);
      return valid ? null : { onlyLetters: true };
    };
  }
}
