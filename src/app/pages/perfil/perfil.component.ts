import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    FloatLabelModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputIconModule,
    ButtonModule,
    SelectButtonModule,
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  usuario: any = {};

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
  stateOptions = [
    { label: 'Perfil', value: 1 },
    { label: 'Alterar Perfil', value: 2 },
  ];

  value: number = 1;

  goToSimulados() {
    this.router.navigate(['/simuladoAleatorio']);
  }

  goToHistorico() {
    this.router.navigate(['/historicoDeSimulados']);
  }
  onSelectButtonChange(event: any) {
    if (event.value === 2) {
      this.router.navigate(['/alterarPerfil']);
      this.value = 1;
    }
  }

  ngOnInit() {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      const parsed = JSON.parse(userData);
      const uuid = parsed.uuid;

      this.carregarUsuario(uuid, token);
    }
  }

  carregarUsuario(uuid: string, token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .get(`http://localhost:8080/usuarios/${uuid}`, { headers })
      .subscribe({
        next: (res: any) => (this.usuario = res),
        error: (err) => console.error('Erro ao buscar usuário:', err),
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
