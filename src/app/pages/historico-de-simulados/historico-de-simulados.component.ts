import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FloatLabel } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import { MultiSelectModule } from 'primeng/multiselect';

interface ProvaUsuarioDTO {
  uuid: string;
  externalId: string;
  titulo: string;
  dataInicio: string;
  dataFim: string | null;
  totalQuestoes: number;
  statusProva: string;
}

interface SimuladoExibicao {
  externalId: string;
  titulo: string;
  criadaEm: string;
  totalHoras: string;
  totalQuestoes: number;
  status: string;
  uuid: string;
}

@Component({
  selector: 'app-historico-de-simulados',
  standalone: true,
  imports: [
    CommonModule,
    FloatLabel,
    FormsModule,
    InputText,
    ButtonModule,
    MultiSelectModule,
  ],
  templateUrl: './historico-de-simulados.component.html',
  styleUrl: './historico-de-simulados.component.css',
})
export class HistoricoDeSimuladosComponent implements OnInit {
  private readonly API_URL = 'http://localhost:8080';

  filtroMes: string = '';
  filtroAno: string = '';
  filtroTitulo: string = '';
  filtroStatus: string = '';
  filtroDia: string = '';

  todosOsSimulados: SimuladoExibicao[] = [];
  simuladosExibidos: SimuladoExibicao[] = [];

  filtroStatusSelecionados: string[] = [];

  statusOptions = [
    { label: 'Em andamento', value: 'EM_ANDAMENTO' },
    { label: 'Pausada', value: 'PAUSADA' },
    { label: 'Finalizada', value: 'FINALIZADA' },
  ];

  loading: boolean = true;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarProvas();
  }

  carregarProvas(): void {
    this.loading = true;
    this.error = null;
    const userUuid = this.authService.getUserUuid();

    if (!userUuid) {
      console.error('Usuário não autenticado');
      this.error = 'Usuário não autenticado';
      this.loading = false;
      this.router.navigate(['/login']);
      return;
    }

    console.log('Carregando provas do usuário:', userUuid);

    this.http
      .get<ProvaUsuarioDTO[]>(`${this.API_URL}/api/provas/usuario/${userUuid}`)
      .subscribe({
        next: (provas) => {
          console.log('Provas carregadas:', provas);

          this.todosOsSimulados = provas.map((prova) =>
            this.converterParaExibicao(prova)
          );

          this.simuladosExibidos = this.todosOsSimulados;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar provas:', err);
          this.error = 'Erro ao carregar histórico de provas';
          this.loading = false;
        },
      });
  }

  private converterParaExibicao(prova: ProvaUsuarioDTO): SimuladoExibicao {
    return {
      uuid: prova.uuid,
      externalId: prova.externalId,
      titulo: prova.titulo,
      criadaEm: this.formatarData(prova.dataInicio),
      totalHoras: this.calcularDuracao(prova.dataInicio, prova.dataFim),
      totalQuestoes: prova.totalQuestoes,
      status:
        prova.statusProva ||
        this.determinarStatus(prova.dataInicio, prova.dataFim),
    };
  }

  private formatarData(dataISO: string): string {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  private calcularDuracao(dataInicio: string, dataFim: string | null): string {
    if (!dataFim) {
      return '-';
    }

    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const diffMs = fim.getTime() - inicio.getTime();

    const horas = Math.floor(diffMs / (1000 * 60 * 60));
    const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diffMs % (1000 * 60)) / 1000);

    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(
      2,
      '0'
    )}:${String(segundos).padStart(2, '0')}`;
  }

  private determinarStatus(dataInicio: string, dataFim: string | null): string {
    if (dataFim) {
      return 'FINALIZADA';
    }
    return 'EM_ANDAMENTO';
  }

  aplicarFiltros(): void {
    let resultado = this.todosOsSimulados;

    if (this.filtroDia) {
      resultado = resultado.filter((simulado) => {
        const diaDoSimulado = simulado.criadaEm.split('/')[0];
        return diaDoSimulado === this.filtroDia;
      });
    }

    if (this.filtroTitulo) {
      resultado = resultado.filter((simulado) =>
        simulado.titulo.toLowerCase().includes(this.filtroTitulo.toLowerCase())
      );
    }

    if (this.filtroAno) {
      resultado = resultado.filter((simulado) => {
        const anoDoSimulado = simulado.criadaEm.split('/')[2];
        return anoDoSimulado === this.filtroAno;
      });
    }

    if (this.filtroMes) {
      resultado = resultado.filter((simulado) => {
        const mesDoSimulado = simulado.criadaEm.split('/')[1];
        return mesDoSimulado === this.filtroMes;
      });
    }

    if (this.filtroStatusSelecionados.length > 0) {
      resultado = resultado.filter((simulado) =>
        this.filtroStatusSelecionados.includes(simulado.status)
      );
    }

    this.simuladosExibidos = resultado;
  }

  retomarProva(uuidProva: string): void {
    console.log('Retomando prova:', uuidProva);

    this.http
      .post(`${this.API_URL}/provas/${uuidProva}/retomar`, {})
      .subscribe({
        next: () => {
          console.log('Status da prova atualizado para EM_ANDAMENTO');

          this.http
            .get<any>(`${this.API_URL}/provas/${uuidProva}/status`)
            .subscribe({
              next: (status) => {
                console.log('Dados do status da prova:', status);
                const questaoRetomar = status.ultimaQuestaoRespondida || 1;

                this.router.navigate([
                  `/provas/${uuidProva}/questao/${questaoRetomar}`,
                ]);
              },
              error: (err) => {
                console.error('Erro ao buscar status da prova:', err);
                this.router.navigate([`/provas/${uuidProva}/questao/1`]);
              },
            });
        },
        error: (err) => {
          console.error('Erro ao retomar prova:', err);
        },
      });
  }

  verResultado(uuidProva: string): void {
    console.log('Visualizando resultado:', uuidProva);
    this.router.navigate([`/resultadoProva/${uuidProva}`]);
  }
}
