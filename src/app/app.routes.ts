// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { DashboardEmployeComponent } from './dashboard/dashboard-employe/dashboard-employe.component';
import { DashboardChefComponent } from './dashboard/dashboard-chef/dashboard-chef.component';
import { DashboardDrhComponent } from './dashboard/dashboard-drh/dashboard-drh.component';
import { DemandeCongeComponent } from './demandes/demande-conge/demande-conge.component';
import { DemandeCongeExceptionnelComponent } from './demandes/demande-conge-exceptionnel/demande-conge-exceptionnel.component';
import { DemandeAutorisationComponent } from './demandes/demande-autorisation/demande-autorisation.component';
import { OrdreMissionComponent } from './demandes/ordre-mission/ordre-mission.component';
import { DemandeFormComponent } from './demande-form/demande-form.component';
import { EmployeesComponent } from './employees/employees.component';
import { AuthGuard } from './auth/auth.guard';
import { LayoutComponent } from './shared/layout/layout.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HistoriqueDemandesComponent } from './historique-demandes/historique-demandes.component';
import { DashboardConciergeComponent } from './dashboard/dashboard-concierge/dashboard-concierge.component';

export const routes: Routes = [
  // --- pages SANS shell (ex : login) ------------------------------
  { path: '', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent }, // ← public

  // --- toutes les pages protégées RENDUES DANS le shell -----------
  {
    path: '',                                 // même segment racine
    component: LayoutComponent,               // <app-layout> contient <app-header> + <router-outlet>
    canActivateChild: [AuthGuard],            // protège tout le bloc
    children: [
      { path: 'dashboard-employe', component: DashboardEmployeComponent },
      { path: 'dashboard-drh', component: DashboardDrhComponent },
      { path: 'dashboard-chef', component: DashboardChefComponent },

      { path: 'demande-conge', component: DemandeCongeComponent },
      { path: 'demande-conge-exceptionnel', component: DemandeCongeExceptionnelComponent },
      { path: 'demande-autorisation', component: DemandeAutorisationComponent },
      { path: 'ordre-mission', component: OrdreMissionComponent },
      { path: 'demande-form', component: DemandeFormComponent },
      { path: 'employees', component: EmployeesComponent },
      { path: 'historique', component: HistoriqueDemandesComponent },
      { path: 'historique-chef', component: DashboardChefComponent },
      { path: 'dashboard-concierge', component: DashboardConciergeComponent, data: { roles: ['CONCIERGE'] } } // Ajout rôle
    ]
  },

  { path: '**', redirectTo: '' }
];