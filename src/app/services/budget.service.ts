import { Injectable } from '@angular/core';
import { CurrentBudget } from '../models/budget';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private budgetData: CurrentBudget[] = [
    {
      name: 'Seo',
      description: "Programació d'una web responsive completa",
      price: 300,
    },
    {
      name: 'Ads',
      description: "Programació d'una web responsive completa",
      price: 400,
    },
    {
      name: 'Web',
      description: "Programació d'una web responsive completa",
      price: 500,
    },
  ];

  getFrases(): CurrentBudget[] {
    return this.budgetData;
  }
}
