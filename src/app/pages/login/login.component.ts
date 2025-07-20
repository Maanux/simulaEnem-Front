import { Component } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';

import { InputTextModule } from 'primeng/inputtext';

import { ButtonModule } from 'primeng/button';

import { SelectButtonModule } from 'primeng/selectbutton';

import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  onSelectButtonChange(event: any) {
    if (event.value === 2) {
      this.router.navigate(['/register']);
      this.value = 1;
    }
  }

  value3: any;
  value4: any;

  onSubmit() {
    console.log('Apelido:', this.value3);
    console.log('Senha:', this.value4);
    console.log('SelectButton value:', this.value);
  }

}
