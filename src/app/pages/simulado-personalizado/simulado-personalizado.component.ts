import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ProvaService, DadosProvaCriada } from '../../services/prova.service';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-simulado-personalizado',
  standalone: true,
  imports: [
    FormsModule,
    AutoCompleteModule,
    SelectButtonModule,
    ButtonModule,
    CommonModule,
    CardModule,
  ],
  templateUrl: './simulado-personalizado.component.html',
  styleUrl: './simulado-personalizado.component.css',
})
export class SimuladoPersonalizadoComponent {
  value: number = 2;
  stateOptions = [
    { label: 'Simulado Aleatório', value: 1 },
    { label: 'Simulado Personalizado', value: 2 },
  ];

  questoesHumanas: number | null = null;
  questoesNatureza: number | null = null;
  questoesLinguagens: number | null = null;
  questoesMatematica: number | null = null;
  questoesIngles: number | null = null;
  questoesEspanhol: number | null = null;

  allNumbers: number[] = Array.from({ length: 180 }, (_, i) => i + 1);
  filteredNumbers: number[] = [];
  loading = false;
  errorMessage = '';

  constructor(private router: Router, private provaService: ProvaService) {}

  goToHistorico() {
    this.router.navigate(['/historicoDeSimulados']);
  }

  goToPerfil() {
    this.router.navigate(['/perfil']);
  }

  onSelectButtonChange(event: any) {
    if (event.value === 1) {
      this.router.navigate(['/simuladoAleatorio']);
      this.value = 2;
    }
  }

  filterNumbers(event: any) {
    const query = event.query;
    this.filteredNumbers = this.allNumbers.filter((num) =>
      num.toString().includes(query)
    );
  }

  get totalQuestoes(): number {
    return (
      (Number(this.questoesHumanas) || 0) +
      (Number(this.questoesNatureza) || 0) +
      (Number(this.questoesLinguagens) || 0) +
      (Number(this.questoesMatematica) || 0) +
      (Number(this.questoesIngles) || 0) +
      (Number(this.questoesEspanhol) || 0)
    );
  }

  get isNumberValid(): boolean {
    return this.totalQuestoes > 0 && this.totalQuestoes <= 180;
  }

  private isValid(): boolean {
    if (!this.isNumberValid) {
      this.errorMessage = 'O total de questões deve ser entre 1 e 180.';
      return false;
    }
    return true;
  }

  gerarSimulado() {
    if (!this.isValid()) return;

    this.loading = true;
    this.errorMessage = '';

    const disciplinas = {
      cienciasHumanas: Number(this.questoesHumanas ?? 0),
      cienciasNatureza: Number(this.questoesNatureza ?? 0),
      linguagens: Number(this.questoesLinguagens ?? 0),
      matematica: Number(this.questoesMatematica ?? 0),
      ingles: Number(this.questoesIngles ?? 0),
      espanhol: Number(this.questoesEspanhol ?? 0),
    };

    console.log('Criando prova personalizada com disciplinas:', disciplinas);

    this.provaService.criarProvaPersonalizada(disciplinas).subscribe({
      next: (provaCriada: DadosProvaCriada) => {
        console.log('Prova personalizada criada:', provaCriada);
        localStorage.setItem('ultima_prova_id', provaCriada.externalId);
        this.router.navigate(['/provas', provaCriada.externalId, 'questao', 1]);
      },
      error: (erro) => {
        console.error('Erro ao criar prova personalizada:', erro);
        this.errorMessage =
          erro.error?.message || 'Erro ao criar simulado. Tente novamente.';
        this.loading = false;
      },
      complete: () => (this.loading = false),
    });
  }
}
