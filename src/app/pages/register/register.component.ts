import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FloatLabelModule } from "primeng/floatlabel";
import { InputMaskModule } from 'primeng/inputmask';
import { MessageModule } from 'primeng/message';

import { PasswordModule } from 'primeng/password';

import { ButtonModule } from 'primeng/button';
import { AuthService, RegisterRequest } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    InputTextModule,
    SelectButtonModule,
    FormsModule,
    FloatLabelModule,
    InputMaskModule,
    MessageModule, PasswordModule, ButtonModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  value: number = 2;
  stateOptions = [
    { label: 'Entrar', value: 1 },
    { label: 'Registrar', value: 2 }
  ];
  
  value1: any; // nome
  value2: any; // sobrenome
  value3: any; // apelido
  value4: any; // email
  value5: any; // telefone
  value6: any; // senha
  value7: any; // confirmar senha
  
  formSubmitted = false;
  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSelectButtonChange(event: any) {
    if (event.value === 1) {
      this.router.navigate(['/login']);
      this.value = 2;
    }
  }


  getNomeError(nomeControl: any): string {
    if (nomeControl?.hasError('required')) {
      return 'Nome é obrigatório';
    }
    return '';
  }

  getSobrenomeError(sobrenomeControl: any): string {
    if (sobrenomeControl?.hasError('required')) {
      return 'Sobrenome é obrigatório';
    }
    return '';
  }

  getApelidoError(apelidoControl: any): string {
    if (apelidoControl?.hasError('required')) {
      return 'Apelido é obrigatório';
    }
    return '';
  }

  getEmailError(emailControl: any): string {
    if (emailControl?.hasError('required')) {
      return 'Email é obrigatório';
    }
    if (emailControl?.hasError('email')) {
      return 'Por favor insira um email válido';
    }
    return '';
  }

  getTelefoneError(telefoneControl: any): string {
    if (telefoneControl?.hasError('required')) {
      return 'Telefone é obrigatório';
    }
    if (telefoneControl?.hasError('pattern')) {
      return 'Telefone inválido';
    }
    return '';
  }

  getSenhaError(senhaControl: any): string {
    if (senhaControl?.hasError('required')) {
      return 'Senha é obrigatória';
    }
    if (senhaControl?.hasError('minlength')) {
      return 'Senha deve ter no mínimo 6 caracteres';
    }
    return '';
  }

  getConfirmacaoSenhaError(confirmacaoControl: any, senhaControl: any): string {
    if (confirmacaoControl?.hasError('required')) {
      return 'Confirmação de senha é obrigatória';
    }
    if (senhaControl?.value !== confirmacaoControl?.value) {
      return 'As senhas não coincidem';
    }
    return '';
  }

  isFormValid(): boolean {
    if (this.value === 1) {
      return !!this.value3 && !!this.value4;
    } else {
      return !!this.value1 && !!this.value2 && !!this.value3 && !!this.value4 &&
        !!this.value5 && !!this.value6 && !!this.value7 &&
        this.value6 === this.value7;
    }
  }

  onSubmit() {
    this.formSubmitted = true;
    
    if (!this.isFormValid()) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const telefoneLimpo = this.value5.replace(/\D/g, '');

    const registerData: RegisterRequest = {
      nome: this.value1,
      sobrenome: this.value2,
      email: this.value4,
      telefone: telefoneLimpo,
      apelido: this.value3,
      senha: this.value6
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        console.log('Registro realizado com sucesso!');
        console.log('Token:', response.token);
        console.log('UUID:', response.uuid);
        

        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Erro no registro:', error);
        if (typeof error.error === 'string') {
          this.errorMessage = error.error; 
        } else {
          this.errorMessage = error.error?.message || 'Erro ao registrar usuário';
        }
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}