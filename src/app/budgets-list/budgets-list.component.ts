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

  currentSort: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  sortBudgets(criteria: string): void {

    if (this.currentSort === criteria) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {

      this.currentSort = criteria;
      this.sortDirection = 'asc';
    }

    this.budgetRequests.sort((a, b) => {
      if (criteria === 'date') {
        const dateA = new Date(a.date || '').getTime();
        const dateB = new Date(b.date || '').getTime();
        return this.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (criteria === 'total') {
        return this.sortDirection === 'asc' ? a.total - b.total : b.total - a.total;
      } else if (criteria === 'name') {
        return this.sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });
  }

}
