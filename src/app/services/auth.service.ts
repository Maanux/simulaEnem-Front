import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface DadosLogin {
  email: string;
  senha: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  apelido: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  uuid: string;
  email: string;
  nome: string;
  apelido: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken()
  );
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/register`, data)
      .pipe(
        tap((response) => {
          const correctedResponse: AuthResponse = {
            token: response.type,
            type: response.token,
            uuid: response.uuid,
            email: response.email,
            nome: response.nome,
            apelido: response.apelido,
          };
          this.saveAuthData(correctedResponse);
        })
      );
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          const correctedResponse: AuthResponse = {
            token: response.type,
            type: response.token,
            uuid: response.uuid,
            email: response.email,
            nome: response.nome,
            apelido: response.apelido,
          };
          this.saveAuthData(correctedResponse);
        })
      );
  }

  private saveAuthData(response: AuthResponse): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, response.token);
      localStorage.setItem(
        this.USER_KEY,
        JSON.stringify({
          uuid: response.uuid,
          email: response.email,
          nome: response.nome,
          apelido: response.apelido,
        })
      );
    }
    this.isAuthenticatedSubject.next(true);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  getUserUuid(): string | null {
    const userData = this.getUserData();
    return userData ? userData.uuid : null;
  }

  getUserData(): any {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(this.USER_KEY);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.isAuthenticatedSubject.next(false);
  }
}
