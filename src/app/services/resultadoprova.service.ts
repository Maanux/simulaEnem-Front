import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResultadoProvaService {
  private readonly API_URL = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getEstatisticas(provaUuid: string): Observable<any> {
    return this.http.get(`${this.API_URL}/provas/${provaUuid}/estatisticas`);
  }

  getEstatisticasDisciplinas(provaUuid: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.API_URL}/provas/${provaUuid}/estatisticas/disciplinas`
    );
  }

  getQuestoes(provaUuid: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/provas/${provaUuid}/questoes`);
  }
}
