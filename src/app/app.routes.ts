import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { SimuladoPersonalizadoComponent } from './pages/simulado-personalizado/simulado-personalizado.component';
import { SimuladoAleatorioComponent } from './pages/simulado-aleatorio/simulado-aleatorio.component';
import { HistoricoDeSimuladosComponent } from './pages/historico-de-simulados/historico-de-simulados.component';
import { ProvaComponent } from './pages/prova/prova.component';
export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeComponent },
    { path: 'simuladoPersonalizado', component: SimuladoPersonalizadoComponent },
    { path: 'simuladoAleatorio', component: SimuladoAleatorioComponent },
    { path: 'historicoDeSimulados', component: HistoricoDeSimuladosComponent },
    { path: "prova", component: ProvaComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
