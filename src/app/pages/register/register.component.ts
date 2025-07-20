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
  value1: any;
  value2: any;
  value3: any;
  value4: any;
  value5: any;
  value6: any;
  value7: any;
  formSubmitted = false;

  constructor(private router: Router) { }

  onSelectButtonChange(event: any) {
    if (event.value === 1) {
      this.router.navigate(['/login']);
      this.value = 2;
    }
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
    if (this.isFormValid()) {
      if (this.value === 1) {
        console.log('Login submitted:', { apelido: this.value3, senha: this.value4 });
      } else {
        console.log('Register submitted:', {
          nome: this.value1,
          sobrenome: this.value2,
          apelido: this.value3,
          email: this.value4,
          telefone: this.value5,
          senha: this.value6
        });
      }
    }
  }
}