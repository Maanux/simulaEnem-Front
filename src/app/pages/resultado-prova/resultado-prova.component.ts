import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ResultadoProvaService } from '../../services/resultadoprova.service';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { ChartModule } from 'primeng/chart';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';

@Component({
  selector: 'app-resultado-prova',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ProgressBarModule,
    ToastModule,
    ChartModule,
    AccordionModule,
    BadgeModule,
    OverlayBadgeModule,
  ],
  templateUrl: './resultado-prova.component.html',
  styleUrls: ['./resultado-prova.component.css'],
  providers: [],
})
export class ResultadoProvaComponent implements OnInit {
  provaUuid!: string;
  estatisticas: any = null;
  estatisticasDisciplinas: any[] = [];
  questoes: any[] = [];
  loading = true;
  errorMessage = '';

  data: any;
  options: any;

  constructor(
    private route: ActivatedRoute,
    private resultadoService: ResultadoProvaService
  ) {}

  ngOnInit(): void {
    this.provaUuid = this.route.snapshot.params['provaUuid'];
    this.loadData();
  }

  formatarSegundosParaMinutos(segundos: number): string {
    const min = Math.floor(segundos / 60)
      .toString()
      .padStart(2, '0');
    const sec = (segundos % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  }

  loadData() {
    this.loading = true;
    this.resultadoService.getEstatisticas(this.provaUuid).subscribe({
      next: (data: any) => (this.estatisticas = data),
      error: (err: any) =>
        (this.errorMessage = 'Erro ao carregar estatísticas da prova'),
    });
    this.resultadoService.getEstatisticasDisciplinas(this.provaUuid).subscribe({
      next: (data: any[]) => {
        this.estatisticasDisciplinas = data;
        this.montarGrafico();
      },
      error: (err: any) =>
        (this.errorMessage = 'Erro ao carregar estatísticas por disciplina'),
    });

    this.resultadoService.getQuestoes(this.provaUuid).subscribe({
      next: (data: any[]) => (this.questoes = data),
      error: (err: any) => (this.errorMessage = 'Erro ao carregar questões'),
      complete: () => (this.loading = false),
    });
  }

  montarGrafico() {
    const labels = this.estatisticasDisciplinas.map((d) => d.disciplina);
    const acertos = this.estatisticasDisciplinas.map((d) => d.acertos);
    const erros = this.estatisticasDisciplinas.map((d) => d.erros);
    const aproveitamento = this.estatisticasDisciplinas.map(
      (d) => d.aproveitamento
    );

    this.data = {
      labels,
      datasets: [
        {
          label: 'Acertos',
          data: acertos,
          backgroundColor: '#4caf50',
        },
        {
          label: 'Erros',
          data: erros,
          backgroundColor: '#f44336',
        },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#333',
          },
        },
        title: {
          display: true,
          text: 'Desempenho por Disciplina',
          color: '#333',
          font: { size: 18 },
        },
      },
      scales: {
        x: {
          ticks: { color: '#333' },
        },
        y: {
          beginAtZero: true,
          ticks: { color: '#333' },
        },
      },
    };
  }
}
