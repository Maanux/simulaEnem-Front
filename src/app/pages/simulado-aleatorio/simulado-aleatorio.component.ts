import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-simulado-aleatorio',
  imports: [FormsModule, AutoCompleteModule, SelectButtonModule, ButtonModule],
  templateUrl: './simulado-aleatorio.component.html',
  styleUrl: './simulado-aleatorio.component.css'
})
export class SimuladoAleatorioComponent {
  value: number = 1;
  stateOptions = [
    { label: 'Simulado Aleatório', value: 1 },
    { label: 'Simulado Personalizado', value: 2 }
  ];

  constructor(private router: Router) { }

  onSelectButtonChange(event: any) {
    if (event.value === 2) {
      this.router.navigate(['/simuladoPersonalizado']);
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

  get isNumberValid(): boolean {
    return this.selectedNumber !== null &&
      this.selectedNumber >= 1 &&
      this.selectedNumber <= 180;
  }

  gerarSimulado() {
    console.log('Número de questões selecionado:', this.selectedNumber);
    this.router.navigate(['/historicoDeSimulados']);
  }

}
