import { Injectable, signal, Signal } from '@angular/core';
import { CurrentBudget, InProgressBudget } from '../models/budget';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import jsonData from '../../assets/data/budgets.json'
import { CustomValidators } from '../shared/validations';

@Injectable({
  providedIn: 'root'
})

export class BudgetService {

  private budgetData: CurrentBudget[] = jsonData;
  private budgetRequests: InProgressBudget[] = [];
  budgetRequestsSignal = signal<InProgressBudget[]>([]);

  selectedPrices$ = new BehaviorSubject<number>(0);
  private showPanelIndexSubject = new BehaviorSubject<number | null>(null);
  showPanelIndex$ = this.showPanelIndexSubject.asObservable();

  inProcessBudget: FormGroup;
  budgetForm: FormGroup;
  pagesAndLanguagesForm: FormGroup;
  private basePrice: number = 0;

  constructor(private fb: FormBuilder) {
    this.budgetForm = this.createBudgetForm();
    this.inProcessBudget = this.fb.group({
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
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

    this.budgetForm.get('budgetsArray')?.valueChanges.subscribe((checkedStates: (boolean | null)[]) => {
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
  }

  loadBudgets(): Observable<CurrentBudget[]> {
    return of(this.budgetData).pipe(
      tap(data => {
        this.budgetData = data;
      })
    );
  }

  private createBudgetForm(): FormGroup {
    const budgetsArray = this.fb.array(this.budgetData.map(() => this.fb.control(false)));
    return this.fb.group({
      budgetsArray
    });
  }

  saveBudgetRequest(): void {
    if (this.inProcessBudget.valid && this.budgetForm.valid) {
      const selectedServices = this.budgetData
        .filter((_, i) => this.budgetForm.get('budgetsArray')?.value[i])
        .map(budget => budget);

      const newBudgetRequest: InProgressBudget = {
        name: this.inProcessBudget.value.nombre,
        phone: this.inProcessBudget.value.telefono,
        email: this.inProcessBudget.value.email,
        items: selectedServices,
        pagesQuantity: this.pagesAndLanguagesForm.get('numPages')?.value,
        languagesQuantity: this.pagesAndLanguagesForm.get('numLanguages')?.value,
        total: this.selectedPrices$.getValue()
      };

      this.budgetRequests.push(newBudgetRequest);
      this.budgetRequestsSignal.set([...this.budgetRequests]);
      this.resetForms();
    }
  }

  getBudgetRequestsSignal(): Signal<InProgressBudget[]> {
    return this.budgetRequestsSignal;
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
    this.selectedPrices$.next(basePrice + additionalPrice);
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

  private resetForms() {
    this.inProcessBudget.reset();
    this.budgetForm.reset();
    this.pagesAndLanguagesForm.reset({
      numPages: 1,
      numLanguages: 1
    });
    this.selectedPrices$.next(0);
    this.basePrice = 0;
  }
}
