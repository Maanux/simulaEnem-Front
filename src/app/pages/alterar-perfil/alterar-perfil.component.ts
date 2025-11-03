import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SelectButtonModule } from 'primeng/selectbutton';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-alterar-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
    SelectButtonModule,
  ],
  templateUrl: './alterar-perfil.component.html',
  styleUrls: ['./alterar-perfil.component.css'],
})
export class AlterarPerfilComponent implements OnInit {
  usuario: any = {
    nome: '',
    sobrenome: '',
    apelido: '',
    email: '',
    telefone: '',
  };

  stateOptions = [
    { label: 'Perfil', value: 1 },
    { label: 'Alterar Perfil', value: 2 },
  ];

  value: number = 2;

  goToSimulados() {
    this.router.navigate(['/simuladoAleatorio']);
  }

  goToHistorico() {
    this.router.navigate(['/historicoDeSimulados']);
  }
  onSelectButtonChange(event: any) {
    if (event.value === 1) {
      this.router.navigate(['/perfil']);
      this.value = 2;
    }
  }

  private apiUrl = 'http://localhost:8080/usuarios';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');

      if (token && userData) {
        const parsed = JSON.parse(userData);
        const uuid = parsed.uuid;
        this.carregarUsuario(uuid, token);
      } else {
        console.error('Token ou user_data não encontrados.');
      }
    }
  }

  salvarAlteracoes() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');

      if (token && userData) {
        const parsed = JSON.parse(userData);
        const uuid = parsed.uuid;
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${token}`
        );

        this.http
          .put(`${this.apiUrl}/${uuid}`, this.usuario, { headers })
          .subscribe({
            next: () => {
              alert('Dados alterados com sucesso!');
              this.router.navigate(['/perfil']);
            },
            error: (err) => {
              console.error('Erro ao salvar alterações:', err);
              this.errorMessage =
                err.error?.message || 'Erro ao salvar alterações.';
            },
          });
      }
    }
  }

  carregarUsuario(uuid: string, token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get(`${this.apiUrl}/${uuid}`, { headers }).subscribe({
      next: (res: any) => {
        this.usuario = res;
      },
      error: (err) => {
        console.error('Erro ao carregar usuário:', err);
      },
    });
  }

  errorMessage: string | null = null;
}
