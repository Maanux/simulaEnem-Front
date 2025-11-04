import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ResultadoProvaService {
  private readonly API_URL = environment.apiUrl;

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
