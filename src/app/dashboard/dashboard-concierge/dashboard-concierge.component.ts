import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EtatConciergeService } from '../../services/etat-concierge/etat-concierge.service';
import { EtatConcierge } from '../../models/EtatConcierge.model';

@Component({
  selector: 'app-dashboard-concierge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-concierge.component.html',
  styleUrls: ['./dashboard-concierge.component.css']
})
export class DashboardConciergeComponent implements OnInit {

  etats: EtatConcierge[] = [];
  loading = true;
  error: string | null = null;

  constructor(private etatService: EtatConciergeService) {}

  ngOnInit(): void {
    this.etatService.getAllEtats().subscribe({
      next: (data) => {
        console.log('Données reçues du service:', data); // Vérifie ici
        this.etats = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement états:', err);
        this.error = 'Erreur chargement états.';
        this.loading = false;
      }
    });
  }
}
