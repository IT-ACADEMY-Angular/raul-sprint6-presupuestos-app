import { Component } from '@angular/core';
import { BudgetService } from '../services/budget.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomValidators } from '../shared/validations';

@Component({
  selector: 'panel-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})

export class PanelComponent {
  pagesAndLanguagesForm;

  showError: Record<string, boolean> = {
    numPages: false,
    numLanguages: false,
  };

  constructor(public budgetService: BudgetService) {
    this.pagesAndLanguagesForm = this.budgetService.pagesAndLanguagesForm;
  }

  incrementPages() {
    this.budgetService.incrementPages();
    this.showError['numPages'] = false;
  }

  decrementPages() {
    this.budgetService.decrementPages();
    this.showError['numPages'] = false;
  }

  incrementLanguages() {
    this.budgetService.incrementLanguages();
    this.showError['numLanguages'] = false;
  }

  decrementLanguages() {
    this.budgetService.decrementLanguages();
    this.showError['numLanguages'] = false;
  }

  //Estos 2 metodos los pongo porque si no, se podian poner en los inputs con numeros científicos como por ejemplo 8e3, he deshabilitado completamentelas las letras.
  onKeydown(event: KeyboardEvent) {
    CustomValidators.preventNonNumericKey(event);
  }

  onInput(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    CustomValidators.sanitizeInput(input);

    this.pagesAndLanguagesForm.patchValue({ [field]: input.value });

    this.showError[field] = input.value === '' || input.value === '0';
  }
}
