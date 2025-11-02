import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { SimuladoPersonalizadoComponent } from './pages/simulado-personalizado/simulado-personalizado.component';
import { SimuladoAleatorioComponent } from './pages/simulado-aleatorio/simulado-aleatorio.component';
import { HistoricoDeSimuladosComponent } from './pages/historico-de-simulados/historico-de-simulados.component';
import { ProvaComponent } from './pages/prova/prova.component';
import { ResultadoProvaComponent } from './pages/resultado-prova/resultado-prova.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { AlterarPerfilComponent } from './pages/alterar-perfil/alterar-perfil.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'simuladoPersonalizado', component: SimuladoPersonalizadoComponent },
  { path: 'simuladoAleatorio', component: SimuladoAleatorioComponent },
  { path: 'historicoDeSimulados', component: HistoricoDeSimuladosComponent },
  { path: 'provas/:provaUuid/questao/:numero', component: ProvaComponent },
  { path: 'resultadoProva/:provaUuid', component: ResultadoProvaComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'alterarPerfil', component: AlterarPerfilComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
