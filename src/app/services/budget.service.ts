import { Injectable } from '@angular/core';
import { CurrentBudget } from '../models/budget';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import jsonData  from '../../assets/data/budgets.json'

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private budgetData: CurrentBudget[] = jsonData;
  private selectedPricesSubject = new BehaviorSubject<number>(0);
  selectedPrices$ = this.selectedPricesSubject.asObservable();

  constructor(private fb: FormBuilder) {}

  loadBudgets(): Observable<CurrentBudget[]> {
    return of(this.budgetData).pipe(
      tap(data => {
        this.budgetData = data;
      })
    );
  }

  getBudgets(): CurrentBudget[] {
    return this.budgetData;
  }

  createBudgetForm(): FormGroup {
    const budgetsArray = this.fb.array(this.budgetData.map(() => this.fb.control(false)));

    budgetsArray.valueChanges.subscribe((checkedStates: (boolean | null)[]) => {
      const selectedPrices = this.calculateSelectedPrices(checkedStates);
      this.selectedPricesSubject.next(selectedPrices);
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
}
