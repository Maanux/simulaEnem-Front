import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

interface Alternativa {
  letter: string;
  text: string;
  file: string | null;
  correct: boolean;
}

interface Questao {
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

@Component({
  selector: 'app-prova',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RadioButtonModule, FormsModule, ButtonModule, RouterModule],
  templateUrl: './prova.component.html',
  styleUrl: './prova.component.css'
})
export class ProvaComponent implements OnInit {

  provaQuestao: ProvaQuestaoResponse | null = null;
  loading: boolean = true;
  error: string | null = null;

  private provaId = 1;
  public questaoId = 1;
  private apiUrl = '';
  categories: any[] = [];
  selectedCategory: any = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.carregarQuestao();
  }

  carregarQuestao(): void {
    this.loading = true;
    this.error = null;


    this.apiUrl = `http://localhost:8080/provas/${this.provaId}/questao/${this.questaoId}`;

    this.http.get<ProvaQuestaoResponse>(this.apiUrl).subscribe({
      next: (data) => {
        this.provaQuestao = data;
        this.loading = false;
        if (this.provaQuestao && this.provaQuestao.questao) {
          this.categories = this.provaQuestao.questao.alternativas.map(alt => ({
            key: alt.letter,
            name: `${alt.letter}) ${alt.text}`
          }));
        }
      },
      error: (err) => {
        console.error('Erro ao carregar a questão:', err);
        this.error = 'Não foi possível carregar a questão. Verifique a API.';
        this.loading = false;
      }
    });
  }

  irProximaQuestao(): void {
    this.questaoId++;
    this.carregarQuestao();
    console.log(this.questaoId);
  }

  voltarQuestao(): void {
    if (this.questaoId > 1) {
      this.questaoId--;
      this.carregarQuestao();
      console.log(this.questaoId);
    }
  }
}