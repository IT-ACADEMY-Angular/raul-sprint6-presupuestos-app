import { Component, Input } from '@angular/core';
import { InProgressBudget } from '../models/budget';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'budgets-list-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './budgets-list.component.html',
  styleUrl: './budgets-list.component.css'
})
export class BudgetsListComponent {
  @Input() budgetRequests: InProgressBudget[] = [];

}
