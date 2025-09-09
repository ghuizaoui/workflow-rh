// src/app/services/notification/notification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NotificationDto {
  id: number;
  subject: string;
  message: string;
  statut: 'NON_LU' | 'LU' | string;
  dateCreation: string; // ISO string
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:9091/api/notifications';

  constructor(private http: HttpClient) { }

  getNotificationsForManager(matricule: string): Observable<NotificationDto[]> {
    return this.http.get<NotificationDto[]>(`${this.apiUrl}/manager/${matricule}`);
  }

  getUnreadNotificationCount(matricule: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/manager/${matricule}/unread-count`);
  }
}
