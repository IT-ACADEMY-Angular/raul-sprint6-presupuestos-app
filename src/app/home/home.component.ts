import { Component, OnInit } from '@angular/core';
import { WelcomeComponent } from '../welcome/welcome.component';
import { BudgetsListComponent } from '../budgets-list/budgets-list.component';
import { CurrentBudget } from '../models/budget';
import { BudgetService } from '../services/budget.service';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'home-component',
  standalone: true,
  imports: [WelcomeComponent, BudgetsListComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  budgets: CurrentBudget[] = [];
  budgetForm: FormGroup;
  selectedPrices: number = 0;

  constructor(private budgetService: BudgetService, private fb: FormBuilder) {
    this.budgetForm = this.fb.group({
      budgetsArray: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.budgets = this.budgetService.getFrases();
    const budgetControls = this.budgetForm.get('budgetsArray') as FormArray;

    this.budgets.forEach(() => budgetControls.push(this.fb.control(false)));

    budgetControls.valueChanges.subscribe((checkedStates: boolean[]) => {
      this.selectedPrices = checkedStates.reduce((total, isChecked, index) => {
        return isChecked ? total + this.budgets[index].price : total;
      }, 0);
    });
  }

}
