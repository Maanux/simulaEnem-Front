import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';

interface Alternativa {
  letter: string;
  text: string;
  file: string | null;
  correct: boolean;
}

interface Questao {
  externalId: string;
  title: string;
  discipline: string;
  year: number;
  context: string;
  files: string[];
  alternativesIntroduction: string;
  alternativas: Alternativa[];
}

interface ProvaQuestaoResponse {
  ordem: number;
  alternativaRespondida: string | null;
  tempoGasto: string;
  questao: Questao;
}

interface StatusProvaResponse {
  provaId: string;
  titulo: string;
  status: string;
  ultimaQuestaoRespondida: number;
  proximaQuestao: number;
  totalQuestoes: number;
  tempoTotalGasto: number;
  mensagem: string;
}

@Component({
  selector: 'app-prova',
  standalone: true,
  imports: [
    CommonModule,
    RadioButtonModule,
    FormsModule,
    ButtonModule,
    RouterModule,
  ],
  templateUrl: './prova.component.html',
  styleUrl: './prova.component.css',
})
export class ProvaComponent implements OnInit {
  provaQuestao: ProvaQuestaoResponse | null = null;
  loading: boolean = true;
  error: string | null = null;
  categories: any[] = [];
  selectedCategory: any = null;

  provaUuid: string = '';
  numeroQuestao: number = 1;

  tempoInicio!: number;
  tempoGasto: number = 0;
  alternativaSelecionada: string | null = null;

  proximaQuestao: number = 0;
  totalQuestoes: number = 0;
  statusCarregado: boolean = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.provaUuid = params['provaUuid'];
      this.numeroQuestao = +params['numero'];

      console.log('Prova UUID:', this.provaUuid);
      console.log('Questão número:', this.numeroQuestao);
      this.carregarStatusProva();
      this.carregarQuestao();
    });
  }

  carregarStatusProva(): void {
    this.http
      .get<StatusProvaResponse>(
        `http://localhost:8080/provas/${this.provaUuid}/status`
      )
      .subscribe({
        next: (res) => {
          this.proximaQuestao = res.proximaQuestao;
          this.totalQuestoes = res.totalQuestoes;
          this.statusCarregado = true;

          console.log('Status carregado:', {
            proximaQuestao: this.proximaQuestao,
            totalQuestoes: this.totalQuestoes,
            ultimaRespondida: res.ultimaQuestaoRespondida,
          });
        },
        error: (err) => {
          console.error('Erro ao carregar status:', err);
          this.statusCarregado = false;
        },
      });
  }

  carregarQuestao(): void {
    this.loading = true;
    this.error = null;

    const apiUrl = `http://localhost:8080/provas/${this.provaUuid}/questao/${this.numeroQuestao}`;

    this.http.get<ProvaQuestaoResponse>(apiUrl).subscribe({
      next: (data) => {
        this.provaQuestao = data;
        this.loading = false;
        this.tempoInicio = Date.now();

        if (data.alternativaRespondida) {
          this.alternativaSelecionada = data.alternativaRespondida;
        }

        if (this.provaQuestao?.questao) {
          this.categories = this.provaQuestao.questao.alternativas.map(
            (alt) => ({
              key: alt.letter,
              name: `${alt.letter}) ${alt.text}`,
            })
          );
        }

        console.log('Questão carregada:', data.ordem);
      },
      error: (err) => {
        console.error('Erro ao carregar a questão:', err);
        this.error = 'Não foi possível carregar a questão. Verifique a API.';
        this.loading = false;
      },
    });
  }

  get isUltimaQuestao(): boolean {
    return this.statusCarregado && this.numeroQuestao === this.totalQuestoes;
  }

  get textoBotaoPrincipal(): string {
    return this.isUltimaQuestao ? 'Finalizar Simulado' : 'Próxima Questão';
  }

  irProximaQuestao(): void {
    if (this.isUltimaQuestao) {
      this.finalizarProva();
      return;
    }

    this.registrarResposta().subscribe({
      next: () => {
        const proxima = this.numeroQuestao + 1;
        console.log('➡️ Indo para questão', proxima);
        this.router.navigate([`/provas/${this.provaUuid}/questao/${proxima}`]);
      },
      error: (err) => {
        console.error('Erro ao registrar resposta:', err);
        const proxima = this.numeroQuestao + 1;
        this.router.navigate([`/prova/${this.provaUuid}/questao/${proxima}`]);
      },
    });
  }

  voltarQuestao(): void {
    if (this.numeroQuestao > 1) {
      this.registrarResposta().subscribe({
        next: () => {
          const anterior = this.numeroQuestao - 1;
          console.log('Voltando para questão', anterior);
          this.router.navigate([
            `/provas/${this.provaUuid}/questao/${anterior}`,
          ]);
        },
        error: (err) => {
          console.error('Erro ao registrar resposta:', err);
          const anterior = this.numeroQuestao - 1;
          this.router.navigate([
            `/prova/${this.provaUuid}/questao/${anterior}`,
          ]);
        },
      });
    }
  }

  registrarResposta(): Observable<any> {
    if (!this.alternativaSelecionada || !this.provaQuestao?.questao) {
      console.log('Nenhuma alternativa selecionada');
      return of(null);
    }

    const tempoAtual = Date.now();
    this.tempoGasto = Math.floor((tempoAtual - this.tempoInicio) / 1000);

    const body = {
      alternativaRespondidada: this.alternativaSelecionada,
      tempoGasto: this.tempoGasto,
    };

    const url = `http://localhost:8080/provas/${this.provaUuid}/questoes/${this.provaQuestao.questao.externalId}/responder`;

    console.log('Registrando resposta:', {
      questao: this.numeroQuestao,
      alternativa: this.alternativaSelecionada,
      tempo: this.tempoGasto,
    });

    return this.http.post(url, body);
  }

  pausarProva(): void {
    const tempoGasto = Math.floor((Date.now() - this.tempoInicio) / 1000);

    const body = {
      ultimaQuestaoRespondida: this.numeroQuestao,
      tempoGasto: tempoGasto,
    };

    console.log('Pausando prova na questão', this.numeroQuestao);

    this.http
      .post(`http://localhost:8080/provas/${this.provaUuid}/pausar`, body)
      .subscribe({
        next: (res) => {
          console.log('Prova pausada com sucesso:', res);
          this.router.navigate(['/historicoDeSimulados']);
        },
        error: (err) => {
          console.error('Erro ao pausar prova:', err);
        },
      });
  }

  finalizarProva(): void {
    console.log('Finalizando prova...');

    this.registrarResposta()
      .pipe(
        switchMap(() => {
          console.log('Última resposta registrada, finalizando...');
          return this.http.post(
            `http://localhost:8080/provas/${this.provaUuid}/finalizar`,
            {}
          );
        })
      )
      .subscribe({
        next: (resultado) => {
          console.log('Prova finalizada com sucesso!', resultado);

          this.router.navigate(['/resultadoProva', this.provaUuid]);
        },
        error: (err) => {
          console.error('Erro ao finalizar prova:', err);

          this.router.navigate(['/historicoDeSimulados']);
        },
      });
  }
}
