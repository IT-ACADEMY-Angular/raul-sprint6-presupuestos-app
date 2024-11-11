import { Component } from '@angular/core';
import { BudgetService } from '../services/budget.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomValidators } from '../shared/validations';
import { ModalComponent } from '../shared/modal/modal.component';

@Component({
  selector: 'panel-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})

export class PanelComponent {
  pagesAndLanguagesForm;

  showError: Record<string, boolean> = {
    numPages: false,
    numLanguages: false,
  };

  isModalOpen = false;
  modalTitle = '';
  modalDescription = '';

  constructor(public budgetService: BudgetService) {
    this.pagesAndLanguagesForm = this.budgetService.pagesAndLanguagesForm;
  }

  openModal(field: string) {
    if (field === 'numPages') {
      this.modalTitle = 'Número de páginas';
      this.modalDescription = 'Añade las páginas que tendrá tu proyecto. El coste de cada página que añadas, será de 30€.';
    } else if (field === 'numLanguages') {
      this.modalTitle = 'Número de idiomas';
      this.modalDescription = 'Añade los idiomas que tendrá tu proyecto. El coste de cada idioma que añadas, será de 30€.';
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
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
