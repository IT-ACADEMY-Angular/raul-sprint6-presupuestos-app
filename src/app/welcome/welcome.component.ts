import { Component } from '@angular/core';

@Component({
  selector: 'welcome-component',
  standalone: true,
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  title: string = 'Frontender.itacademy';
  subtitle: string = 'Consigue la mejor calidad';
}
