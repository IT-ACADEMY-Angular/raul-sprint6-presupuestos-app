import { Injectable } from '@angular/core';
import { CurrentBudget } from '../models/budget';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import jsonData from '../../assets/data/budgets.json'
import { CustomValidators } from '../shared/validations';

@Injectable({
  providedIn: 'root'
})

export class BudgetService {

  private budgetData: CurrentBudget[] = jsonData;

  private selectedPricesSubject = new BehaviorSubject<number>(0);
  selectedPrices$ = this.selectedPricesSubject.asObservable();

  private showPanelIndexSubject = new BehaviorSubject<number | null>(null);
  showPanelIndex$ = this.showPanelIndexSubject.asObservable();

  pagesAndLanguagesForm: FormGroup;

  private basePrice: number = 0;

  constructor(private fb: FormBuilder) {
    this.pagesAndLanguagesForm = this.fb.group({
      numPages: [1, [CustomValidators.onlyNumbers(), CustomValidators.minimumValue(1)]],
      numLanguages: [1, [CustomValidators.onlyNumbers(), CustomValidators.minimumValue(1)]]
    });

    this.pagesAndLanguagesForm.valueChanges.subscribe(({ numPages, numLanguages }) => {
      const pages = Number(numPages) || 0;
      const languages = Number(numLanguages) || 0;
      const additionalPrice = pages > 0 || languages > 0 ? this.calculateAdditionalPrice(pages, languages) : 0;
      this.updateTotalPrice(this.basePrice, additionalPrice);
    });
  }

  loadBudgets(): Observable<CurrentBudget[]> {
    return of(this.budgetData).pipe(
      tap(data => {
        this.budgetData = data;
      })
    );
  }

  createBudgetForm(): FormGroup {
    const budgetsArray = this.fb.array(this.budgetData.map(() => this.fb.control(false)));

    budgetsArray.valueChanges.subscribe((checkedStates: (boolean | null)[]) => {
      this.basePrice = this.calculateSelectedPrices(checkedStates);
      const additionalPrice = this.calculateAdditionalPrice(
        this.pagesAndLanguagesForm.get('numPages')!.value,
        this.pagesAndLanguagesForm.get('numLanguages')!.value
      );

      const webIndex = this.budgetData.findIndex(b => b.name === 'Desarrollo (WEB)');
      const webSelected = checkedStates[webIndex] ?? false;

      if (!webSelected) {
        this.resetAdditionalOptions();
      }

      this.updateTotalPrice(this.basePrice, webSelected ? additionalPrice : 0);
      this.showPanelIndexSubject.next(webSelected ? webIndex : null);
    });

    return this.fb.group({
      budgetsArray
    });
  }

  private calculateSelectedPrices(checkedStates: (boolean | null)[]): number {
    return checkedStates.reduce((total, isChecked, index) => {
      return (isChecked ?? false) ? total + this.budgetData[index].price : total;
    }, 0);
  }

  private calculateAdditionalPrice(pages: number, languages: number): number {
    return pages * 30 + languages * 30;
  }

  private updateTotalPrice(basePrice: number, additionalPrice: number) {
    this.selectedPricesSubject.next(basePrice + additionalPrice);
  }

  private resetAdditionalOptions() {
    this.pagesAndLanguagesForm.get('numPages')?.setValue(1, { emitEvent: false });
    this.pagesAndLanguagesForm.get('numLanguages')?.setValue(1, { emitEvent: false });
  }

  incrementPages() {
    const current = Number(this.pagesAndLanguagesForm.get('numPages')!.value) || 0;
    this.pagesAndLanguagesForm.get('numPages')?.setValue(current ? current + 1 : 1);
  }

  decrementPages() {
    const current = Number(this.pagesAndLanguagesForm.get('numPages')!.value) || 1;
    if (current > 1) {
      this.pagesAndLanguagesForm.get('numPages')?.setValue(current - 1);
    }
  }

  incrementLanguages() {
    const current = Number(this.pagesAndLanguagesForm.get('numLanguages')!.value) || 0;
    this.pagesAndLanguagesForm.get('numLanguages')?.setValue(current ? current + 1 : 1);
  }

  decrementLanguages() {
    const current = Number(this.pagesAndLanguagesForm.get('numLanguages')!.value) || 1;
    if (current > 1) {
      this.pagesAndLanguagesForm.get('numLanguages')?.setValue(current - 1);
    }
  }

}
