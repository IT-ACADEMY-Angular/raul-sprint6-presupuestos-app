import { Component, Input } from '@angular/core';
import { InProgressBudget } from '../models/budget';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'budgets-list-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './budgets-list.component.html',
  styleUrl: './budgets-list.component.css'
})
export class BudgetsListComponent {
  @Input() budgetRequests: InProgressBudget[] = [];
  filteredBudgetRequests: InProgressBudget[] = [];

  currentSort: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  showSearchBox: boolean = false;
  searchText: string = '';

  ngOnInit(): void {
    this.filteredBudgetRequests = [...this.budgetRequests];
  }

  ngOnChanges(): void {
    this.filteredBudgetRequests = this.filterBudgets();
  }

  sortBudgets(criteria: string): void {
    if (this.currentSort === criteria) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort = criteria;
      this.sortDirection = 'asc';
    }

    this.filteredBudgetRequests = this.sortFilteredBudgets(criteria);
  }

  toggleSearchBox(): void {
    this.showSearchBox = !this.showSearchBox;
    if (!this.showSearchBox) {
      this.searchText = '';
      this.filteredBudgetRequests = this.filterBudgets();
    }
  }

  onSearchChange(): void {
    this.filteredBudgetRequests = this.filterBudgets();
  }

  private filterBudgets(): InProgressBudget[] {
    return this.budgetRequests.filter(request =>
      request.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  private sortFilteredBudgets(criteria: string): InProgressBudget[] {
    return [...this.filteredBudgetRequests].sort((a, b) => {
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
