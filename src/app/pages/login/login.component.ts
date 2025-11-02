import { Component } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';

import { InputTextModule } from 'primeng/inputtext';

import { ButtonModule } from 'primeng/button';

import { SelectButtonModule } from 'primeng/selectbutton';

import { Router } from '@angular/router';
import { AuthService, DadosLogin } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    PasswordModule,
    FormsModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    SelectButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  value: number = 1;
  stateOptions = [
    { label: 'Entrar', value: 1 },
    { label: 'Registrar', value: 2 }
  ];

  email: any; 
  senha: any; 

  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSelectButtonChange(event: any) {
    if (event.value === 2) {
      this.router.navigate(['/register']);
      this.value = 1;
    }
  }

  onSubmit() {
    if (!this.email || !this.senha) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const dadosLogin: DadosLogin = {
      email: this.email,
      senha: this.senha
    };

    this.authService.login(dadosLogin).subscribe({
      next: (dadosToken) => {
        console.log('Login realizado com sucesso!');
        console.log('Token:', dadosToken.token);
        console.log('UUID:', dadosToken.uuid);
        
        this.router.navigate(['/simuladoAleatorio']);
      },
      error: (erro) => {
        console.error('Erro no login:', erro);
        this.errorMessage = 'Email ou senha incorretos';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
