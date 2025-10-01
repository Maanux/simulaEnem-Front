import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatLabel } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

interface Simulado {
  titulo: string;
  criadaEm: string;
  totalHoras: string;
  acertos: number;
  totalQuestoes: number;
  status: string;
}

@Component({
  selector: 'app-historico-de-simulados',
  standalone: true,
  imports: [CommonModule, FloatLabel, FormsModule, InputText, ButtonModule],
  templateUrl: './historico-de-simulados.component.html',
  styleUrl: './historico-de-simulados.component.css'
})
export class HistoricoDeSimuladosComponent implements OnInit {

  filtroMes: string = '';
  filtroAno: string = '';
  filtroTitulo: string = '';
  filtroStatus: string = '';

  private todosOsSimulados: Simulado[] = [];

  simuladosExibidos: Simulado[] = [];

  constructor() {
    this.todosOsSimulados = [
      { titulo: 'Prova Aleatória', criadaEm: '15/04/2026', totalHoras: '11:12:34', acertos: 13, totalQuestoes: 20, status: 'em_andamento' },
      { titulo: 'Simulado de Português', criadaEm: '20/03/2026', totalHoras: '01:30:00', acertos: 18, totalQuestoes: 20, status: 'finalizada' },
      { titulo: 'Teste de Matemática', criadaEm: '05/04/2025', totalHoras: '02:00:00', acertos: 10, totalQuestoes: 15, status: 'pausada' },
      { titulo: 'Prova Geral', criadaEm: '10/01/2025', totalHoras: '03:45:10', acertos: 35, totalQuestoes: 50, status: 'finalizada' },
      { titulo: 'Prova Aleatória de Lógica', criadaEm: '18/03/2026', totalHoras: '00:55:23', acertos: 8, totalQuestoes: 10, status: 'em_andamento' },
    ];
  }

  ngOnInit(): void {
    this.simuladosExibidos = this.todosOsSimulados;
  }

  aplicarFiltros(): void {

    let resultado = this.todosOsSimulados;

    if (this.filtroTitulo) {
      resultado = resultado.filter(simulado =>
        simulado.titulo.toLowerCase().includes(this.filtroTitulo.toLowerCase())
      );
    }

    if (this.filtroAno) {
      resultado = resultado.filter(simulado => {
        const anoDoSimulado = simulado.criadaEm.split('/')[2];
        return anoDoSimulado === this.filtroAno;
      });
    }

    if (this.filtroMes) {
      resultado = resultado.filter(simulado => {
        const mesDoSimulado = simulado.criadaEm.split('/')[1];
        return mesDoSimulado === this.filtroMes;
      });
    }

    if (this.filtroStatus) {
      resultado = resultado.filter(simulado =>
        simulado.status.toLowerCase().includes(this.filtroStatus.toLowerCase())
      );
    }

    this.simuladosExibidos = resultado;
  }
}