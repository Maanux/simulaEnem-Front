import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-simulado-personalizado',
  imports: [FormsModule, AutoCompleteModule, SelectButtonModule, ButtonModule],
  templateUrl: './simulado-personalizado.component.html',
  styleUrl: './simulado-personalizado.component.css'
})
export class SimuladoPersonalizadoComponent {
  value: number = 2;
  stateOptions = [
    { label: 'Simulado Aleatório', value: 1 },
    { label: 'Simulado Personalizado', value: 2 }
  ];

  constructor(private router: Router) { }

  onSelectButtonChange(event: any) {
    if (event.value === 1) {
      this.router.navigate(['/simuladoAleatorio']);
      this.value = 2;
    }
  }

  questoesHumanas: number | null = null;
  questoesNatureza: number | null = null;
  questoesLinguagens: number | null = null;
  questoesMatematica: number | null = null;
  questoesIngles: number | null = null;
  questoesEspanhol: number | null = null;
  allNumbers: number[] = Array.from({ length: 180 }, (_, i) => i + 1);
  filteredNumbers: number[] = [];


  filterNumbers(event: any) {
    const query = event.query;
    this.filteredNumbers = this.allNumbers.filter(num =>
      num.toString().includes(query)
    );
  }

  get totalQuestoes(): number {
    const humanas = Number(this.questoesHumanas) || 0;
    const natureza = Number(this.questoesNatureza) || 0;
    const linguagens = Number(this.questoesLinguagens) || 0;
    const matematica = Number(this.questoesMatematica) || 0;
    const ingles = Number(this.questoesIngles) || 0;
    const espanhol = Number(this.questoesEspanhol) || 0;

    return humanas + natureza + linguagens + matematica + ingles + espanhol;
  }

  get isNumberValid(): boolean {
    const total = this.totalQuestoes;
    return total > 0 && total <= 180;
  }

  gerarSimulado() {
    const totalQuestoes = Number(this.questoesHumanas ?? 0) +
      Number(this.questoesNatureza ?? 0) +
      Number(this.questoesLinguagens ?? 0) +
      Number(this.questoesMatematica ?? 0) +
      Number(this.questoesIngles ?? 0) +
      Number(this.questoesEspanhol ?? 0);

    console.log('Número total de questões selecionado:', totalQuestoes);
    this.router.navigate(['/historicoDeSimulados']);
  }
}
