import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../services/auth/auth.service';
import { FirstLoginService } from '../services/Firstlogin/first-login.service';
import { LoginResponse, LoginRequest } from '../models/Auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, RouterLink]
})
export class LoginComponent {
  matricule = '';
  motDePasse = '';
  error = '';
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private firstLogin: FirstLoginService
  ) {}

  onSubmit(): void {
    if (this.isSubmitting) return;

    // Validation des champs
    if (!this.matricule.trim() || !this.motDePasse.trim()) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    this.isSubmitting = true;
    this.error = '';

    const payload: LoginRequest = {
      matricule: this.matricule.trim(),
      motDePasse: this.motDePasse
    };

    console.log('[LOGIN] Attempting login for matricule:', payload.matricule);

    this.authService.login(payload).subscribe({
      next: (response: LoginResponse) => {
        console.log('[LOGIN] Login successful:', response);

        // Les tokens sont déjà stockés dans AuthService
        // Redirection selon le rôle
        this.redirectUserByRole(response.role);
        this.isSubmitting = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('[LOGIN] Login failed:', err);
        this.isSubmitting = false;

        // Cas "première connexion" géré par le backend (423 Locked)
        if (err.status === 423 && err.error?.firstLogin) {
          console.log('[LOGIN] First login detected, redirecting to password change');
          this.firstLogin.matricule = err.error.matricule;
          this.router.navigate(['/reset-password']);
          return;
        }

        // Autres erreurs
        this.handleLoginError(err);
      }
    });
  }

  private redirectUserByRole(role: string): void {
    console.log('[LOGIN] Redirecting user with role:', role);

    switch (role) {
      case 'EMPLOYE':
        this.router.navigate(['/dashboard-employe']);
        break;
      case 'CHEF':
        this.router.navigate(['/dashboard-chef']);
        break;
      case 'DRH':
        this.router.navigate(['/dashboard-drh']);
        break;
      case 'CONCIERGE':
        this.router.navigate(['/dashboard-concierge']);
        break;
      default:
        console.warn('[LOGIN] Unknown role:', role);
        this.router.navigate(['/']);
        break;
    }
  }

  private handleLoginError(err: HttpErrorResponse): void {
    switch (err.status) {
      case 401:
        this.error = 'Identifiants invalides. Vérifiez votre matricule et mot de passe.';
        break;
      case 403:
        this.error = 'Accès refusé. Votre compte peut être désactivé.';
        break;
      case 500:
        this.error = 'Erreur serveur. Veuillez réessayer plus tard.';
        break;
      case 0:
        this.error = 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
        break;
      default:
        this.error = 'Une erreur inattendue s\'est produite. Veuillez réessayer.';
        break;
    }

    console.error('[LOGIN] Error details:', this.error);
  }

  onForgotPassword(): void {
    alert('Veuillez contacter le support pour réinitialiser votre mot de passe.');
  }

  // Méthode utilitaire pour nettoyer les champs
  clearFields(): void {
    this.matricule = '';
    this.motDePasse = '';
    this.error = '';
  }
}
