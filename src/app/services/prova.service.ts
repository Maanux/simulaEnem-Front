import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface AlternativaDTO {
  letter: string;
  text: string;
  file: string | null;
  correct: boolean;
}

export interface QuestaoCompletaDTO {
  externalId: string;
  title: string;
  discipline: string;
  year: number;
  context: string | null;
  files: string[];
  alternativesIntroduction: string | null;
  alternativas: AlternativaDTO[];
}

export interface DadosProvaCriada {
  externalId: string;
  titulo: string;
  status: string;
  dataInicio: string;
  questoes: QuestaoCompletaDTO[];
}

@Injectable({
  providedIn: 'root',
})
export class ProvaService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getUserUuid(): string {
    const userUuid = this.authService.getUserUuid();
    if (!userUuid) {
      throw new Error('Usuário não autenticado');
    }
    return userUuid;
  }

  criarProvaAleatoria(
    quantidadeQuestoes: number
  ): Observable<DadosProvaCriada> {
    const request = {
      externalId: this.getUserUuid(),
      quantidadeQuestoes,
    };
    console.log('Criando prova aleatória:', request);
    return this.http.post<DadosProvaCriada>(
      `${this.API_URL}/provas/criaraleatoria`,
      request
    );
  }

  criarProvaPersonalizada(disciplinas: {
    cienciasHumanas?: number;
    cienciasNatureza?: number;
    linguagens?: number;
    matematica?: number;
    ingles?: number;
    espanhol?: number;
  }): Observable<DadosProvaCriada> {
    const request = {
      externalId: this.getUserUuid(),
      ...disciplinas,
    };
    console.log('Criando prova personalizada:', request);
    return this.http.post<DadosProvaCriada>(
      `${this.API_URL}/provas/criarpordisciplina`,
      request
    );
  }

  buscarProvasDoUsuario(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.API_URL}/api/provas/usuario/${this.getUserUuid()}`
    );
  }
}
