import { Component, OnInit } from '@angular/core';
import { WelcomeComponent } from '../welcome/welcome.component';
import { CurrentBudget } from '../models/budget';
import { BudgetService } from '../services/budget.service';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { PanelComponent } from '../panel/panel.component';

@Component({
  selector: 'home-component',
  standalone: true,
  imports: [WelcomeComponent, CommonModule, ReactiveFormsModule, PanelComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  budgets: CurrentBudget[] = [];
  budgetForm: FormGroup = new FormGroup({});
  selectedPrices: number = 0;
  showPanelIndex$: Observable<number | null>;

  constructor(private budgetService: BudgetService) {
    this.showPanelIndex$ = this.budgetService.showPanelIndex$;
  }

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
