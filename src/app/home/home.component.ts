import { Component, OnInit } from '@angular/core';
import { WelcomeComponent } from '../welcome/welcome.component';
import { CurrentBudget } from '../models/budget';
import { BudgetService } from '../services/budget.service';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { PanelComponent } from '../panel/panel.component';
import { BudgetsListComponent } from '../budgets-list/budgets-list.component';

@Component({
  selector: 'home-component',
  standalone: true,
  imports: [WelcomeComponent, CommonModule, ReactiveFormsModule, PanelComponent, BudgetsListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  budgets: CurrentBudget[] = [];
  budgetForm: FormGroup;
  inProcessBudget: FormGroup;
  selectedPrices$: Observable<number>;
  showPanelIndex$: Observable<number | null>;

  constructor(private budgetService: BudgetService) {
    this.budgetForm = this.budgetService.budgetForm;
    this.inProcessBudget = this.budgetService.inProcessBudget;
    this.selectedPrices$ = this.budgetService.selectedPrices$;
    this.showPanelIndex$ = this.budgetService.showPanelIndex$;
  }

  ngOnInit(): void {
    this.budgetService.loadBudgets().subscribe(data => this.budgets = data);
  }

  inProcessBudgetForm(): void {
    this.budgetService.saveBudgetRequest();
  }
}
