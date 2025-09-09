import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EtatConcierge } from '../../models/EtatConcierge.model';

@Injectable({ providedIn: 'root' })
export class EtatConciergeService {

  private apiUrl = 'http://localhost:9091/api/etats-concierge';

  constructor(private http: HttpClient) {}

  getAllEtats(): Observable<EtatConcierge[]> {
    return this.http.get<EtatConcierge[]>(`${this.apiUrl}/all`);  // Call backend endpoint.
  }
}