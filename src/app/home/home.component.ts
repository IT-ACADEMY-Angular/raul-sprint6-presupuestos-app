import { Component } from '@angular/core';
import { WelcomeComponent } from '../welcome/welcome.component';
import { BudgetsListComponent } from '../budgets-list/budgets-list.component';

@Component({
  selector: 'home-component',
  standalone: true,
  imports: [WelcomeComponent, BudgetsListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
