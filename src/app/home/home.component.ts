import { Component, OnInit } from '@angular/core';
import { WelcomeComponent } from '../welcome/welcome.component';
import { BudgetsListComponent } from '../budgets-list/budgets-list.component';
import { CurrentBudget } from '../models/budget';
import { BudgetService } from '../services/budget.service';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'home-component',
  standalone: true,
  imports: [WelcomeComponent, BudgetsListComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  budgets: CurrentBudget[] = [];
  budgetForm: FormGroup = new FormGroup({});
  selectedPrices: number = 0;

  constructor(private budgetService: BudgetService) {}

  ngOnInit(): void {
    this.budgetService.loadBudgets().subscribe((data: CurrentBudget[]) => {
      this.budgets = data;
      this.budgetForm = this.budgetService.createBudgetForm();
      
      this.budgetService.selectedPrices$.subscribe(price => {
        this.selectedPrices = price;
      });
    });
  }

}
