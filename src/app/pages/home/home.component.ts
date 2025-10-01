import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SelectButtonModule } from 'primeng/selectbutton';
@Component({
  selector: 'app-home',
  imports: [AutoCompleteModule, FormsModule, SelectButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  value: number = 1;
  stateOptions = [
    { label: 'Simulado Aleatorio', value: 1 },
    { label: 'Simulado Personalizado', value: 2 }
  ];

  constructor(private router: Router) { }

  onSelectButtonChange(event: any) {
    if (event.value === 2) {
      this.router.navigate(['/register']);
      this.value = 1;
    }
  }

  selectedNumber: number | null = null;
  allNumbers: number[] = Array.from({ length: 180 }, (_, i) => i + 1);
  filteredNumbers: number[] = [];


  filterNumbers(event: any) {
    const query = event.query;
    this.filteredNumbers = this.allNumbers.filter(num =>
      num.toString().includes(query)
    );
  }



}
