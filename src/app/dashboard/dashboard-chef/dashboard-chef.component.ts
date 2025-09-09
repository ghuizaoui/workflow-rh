import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { EmployeService } from '../../services/employe/employe.service';
import { SoldeService } from '../../services/solde/solde.service';
import { DemandeService } from '../../services/demande/demande.service';
import { NotificationService } from '../../services/notification/notification.service';

import { Employe } from '../../models/Employe.model';
import { SoldeConge } from '../../models/SoldeConge.model';
import { Demande } from '../../models/Demande.model';
import { NotificationDto } from './../../services/notification/notification.service';

@Component({
  selector: 'app-dashboard-chef',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './dashboard-chef.component.html',
  styleUrls: ['./dashboard-chef.component.css']
})
export class DashboardChefComponent implements OnInit {

  matricule: string = '';
  employe: Employe | null = null;
  soldeConge: SoldeConge | null = null;
  demandesEnAttente: Demande[] = [];
  historiqueSubordonnes: Demande[] = [];
  notifications: NotificationDto[] = [];
  unreadCount: number = 0;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private employeService: EmployeService,
    private soldeService: SoldeService,
    private demandeService: DemandeService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void { }

  loadEmployeData(): void {
    if (!this.matricule) {
      this.error = "Veuillez entrer un matricule.";
      return;
    }

    this.loading = true;
    this.error = null;

    // --- Charger employé ---
    this.employeService.getEmployeByMatricule(this.matricule).subscribe({
      next: (employe: Employe) => {
        this.employe = employe;
        this.loadChefData(this.matricule);
        this.loadNotifications();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.employe = null;
        this.soldeConge = null;
        this.demandesEnAttente = [];
        this.historiqueSubordonnes = [];
        this.error = "Impossible de trouver un employé avec ce matricule.";
        console.error("Error fetching employee:", err);
      }
    });

    // --- Charger solde de congé ---
    this.soldeService.getSoldeActuel(this.matricule).subscribe({
      next: (solde) => this.soldeConge = solde,
      error: (err) => console.error("Error fetching leave balance:", err)
    });

    // --- Charger notifications ---
    this.notificationService.getNotificationsForManager(this.matricule).subscribe({
      next: (notifications: NotificationDto[]) => {
        this.notifications = notifications;
        console.log('Notifications reçues:', notifications);
      },
      error: (err) => console.error("Error fetching notifications:", err)
    });

    this.notificationService.getUnreadNotificationCount(this.matricule).subscribe({
      next: (count: number) => this.unreadCount = count,
      error: (err) => console.error("Error fetching unread notification count:", err)
    });
  }

  private loadChefData(matricule: string): void {
    // --- Demandes en attente ---
    this.demandeService.getDemandesEnAttente().subscribe({
      next: (demandes: Demande[]) => this.demandesEnAttente = demandes,
      error: (err) => console.error("Error fetching pending requests:", err)
    });

    // --- Historique des subordonnés ---
    this.demandeService.getHistoriqueSubordonnes(matricule).subscribe({
      next: (historique: Demande[]) => this.historiqueSubordonnes = historique,
      error: (err) => console.error("Error fetching subordinates' history:", err)
    });
  }
  private loadNotifications(): void {
    // 🔹 Notifications totales
    this.notificationService.getNotificationsForManager(this.matricule).subscribe({
      next: (notifications: NotificationDto[]) => {
        this.notifications = notifications;
        console.log('Notifications reçues:', notifications);
      },
      error: (err) => console.error("Error fetching notifications:", err)
    });

    // 🔹 Nombre de notifications non lues
    this.notificationService.getUnreadNotificationCount(this.matricule).subscribe({
      next: (count: number) => {
        this.unreadCount = count;
        console.log('Unread count:', count);
      },
      error: (err) => console.error("Error fetching unread notification count:", err)
    });
  }
}
