import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ProvaService } from '../../services/prova.service';
import { CardModule } from 'primeng/card';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-simulado-aleatorio',
  standalone: true,
  imports: [
    FormsModule,
    AutoCompleteModule,
    SelectButtonModule,
    ButtonModule,
    CommonModule,
    CardModule,
  ],
  templateUrl: './simulado-aleatorio.component.html',
  styleUrl: './simulado-aleatorio.component.css',
})
export class SimuladoAleatorioComponent {
  value: number = 1;
  stateOptions = [
    { label: 'Simulado Aleatório', value: 1 },
    { label: 'Simulado Personalizado', value: 2 },
  ];

  selectedNumber: number | null = null;
  allNumbers: number[] = Array.from({ length: 180 }, (_, i) => i + 1);
  filteredNumbers: number[] = [];

  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private provaService: ProvaService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  goToHistorico() {
    this.router.navigate(['/historicoDeSimulados']);
  }

  goToPerfil() {
    this.router.navigate(['/perfil']);
  }

  onSelectButtonChange(event: any) {
    if (event.value === 2) {
      this.router.navigate(['/simuladoPersonalizado']);
      this.value = 1;
    }
  }

  filterNumbers(event: any) {
    const query = event.query;
    this.filteredNumbers = this.allNumbers.filter((num) =>
      num.toString().includes(query)
    );
  }

  get isNumberValid(): boolean {
    return (
      this.selectedNumber !== null &&
      this.selectedNumber >= 1 &&
      this.selectedNumber <= 180
    );
  }

  gerarSimulado() {
    if (!this.isNumberValid || !this.selectedNumber) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    console.log('Gerando simulado com', this.selectedNumber, 'questões...');

    this.provaService.criarProvaAleatoria(this.selectedNumber).subscribe({
      next: (provaCriada: { externalId: string; questoes: string | any[] }) => {
        console.log('Prova criada com sucesso!', provaCriada);
        console.log('Prova UUID:', provaCriada.externalId);
        console.log('Total de questões:', provaCriada.questoes.length);

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('ultima_prova_id', provaCriada.externalId);
        }

        this.router.navigate(['/provas', provaCriada.externalId, 'questao', 1]);
      },
      error: (erro: { error: { message: string } }) => {
        console.error('Erro ao criar prova:', erro);
        this.errorMessage =
          erro.error?.message || 'Erro ao criar simulado. Tente novamente.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
