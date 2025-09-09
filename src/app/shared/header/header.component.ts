import {Component, OnInit, HostListener, OnDestroy, Renderer2} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {NgClass, NgIf, TitleCasePipe} from '@angular/common';
import {Employe} from '../../models/Employe.model';
import {AuthService} from '../../services/auth/auth.service';
import {Role} from '../../models/Role.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [
    FormsModule,
    NgClass,
    NgIf,
    TitleCasePipe,
    RouterLink
  ],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isSidebarOpen = false;
  isDashboardOpen = true;
  isNotificationDropdownOpen = false;
  isNotificationActionsOpen = false;
  isLanguageDropdownOpen = false;
  isThemeDropdownOpen = false;
  isUserDropdownOpen = false;
  isSearchDropdownOpen = false;
  searchQuery = '';
  currentRoute = '';
  currentTheme: string = 'light';
  isLeaveOpen = false;
  isRequestsOpen = false;
  currentUser?: Employe;
  userRole?: string;

  private userSubscription?: Subscription;

  notifications = [
    { message: 'New message from Angela', time: 'Just now', read: false },
    { message: 'Project update available', time: '10 min ago', read: true },
    { message: 'Meeting scheduled at 2 PM', time: '1 hour ago', read: false }
  ];
  selectedNotifications: number[] = [];

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url.split('/').pop() || '';
    this.loadThemePreference();
    window.addEventListener('scroll', this.toggleBackToTop);

    // Charger l'utilisateur actuel si authentifié
    if (this.authService.isAuthenticated()) {
      this.loadCurrentUser();
    }

    // S'abonner aux changements d'utilisateur
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user || undefined;
      this.userRole = user?.role || undefined;
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.toggleBackToTop);

    // Nettoyer les abonnements
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private loadCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        console.log('[HEADER] User loaded successfully:', user.matricule);
        this.currentUser = user;
        this.userRole = user.role;
      },
      error: (error) => {
        console.error('[HEADER] Failed to load current user:', error);
        this.currentUser = undefined;
        this.userRole = undefined;

        // Ne pas déconnecter ici - laisser l'intercepteur gérer les erreurs d'authentification
        // L'intercepteur tentera de rafraîchir le token automatiquement
      }
    });
  }

  // ---------- Dark/Light Theme Switch ----------
  toggleTheme(theme: string): void {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }

  loadThemePreference(): void {
    const theme = localStorage.getItem('theme') || 'light';
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-bs-theme', theme);
  }

  // Toggle sidebar menu
  toggleMenu(): void {
    const html = document.documentElement;
    const currentSize = html.getAttribute('data-sidebar-size');
    html.setAttribute('data-sidebar-size', currentSize === 'lg' ? 'sm' : 'lg');
    this.closeOtherDropdowns('sidebar');
  }

  // Close sidebar on overlay click
  closeSidebar(): void {
    const html = document.documentElement;
    html.setAttribute('data-sidebar-size', 'lg');
  }

  toggleDashboard($event: MouseEvent): void {
    $event.preventDefault();
    this.isDashboardOpen = !this.isDashboardOpen;
  }

  toggleNotificationDropdown(): void {
    this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen;
    this.closeOtherDropdowns('notification');
  }

  toggleNotificationActions(): void {
    this.isNotificationActionsOpen = !this.isNotificationActionsOpen;
  }

  toggleLanguageDropdown(): void {
    this.isLanguageDropdownOpen = !this.isLanguageDropdownOpen;
    this.closeOtherDropdowns('language');
  }

  toggleThemeDropdown(): void {
    this.isThemeDropdownOpen = !this.isThemeDropdownOpen;
    this.closeOtherDropdowns('theme');
  }

  toggleUserDropdown(): void {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
    this.closeOtherDropdowns('user');
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.isSearchDropdownOpen = false;
  }

  selectLanguage(lang: string, title: string): void {
    console.log(`Selected language: ${title}`);
    this.isLanguageDropdownOpen = false;
  }

  toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  markAsRead(index: number): void {
    this.notifications[index].read = true;
    this.isNotificationDropdownOpen = false;
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.isNotificationActionsOpen = false;
  }

  clearAllNotifications(): void {
    this.notifications = [];
    this.isNotificationActionsOpen = false;
    this.isNotificationDropdownOpen = false;
  }

  archiveAllNotifications(): void {
    this.notifications = this.notifications.filter(n => n.read);
    this.isNotificationActionsOpen = false;
    this.isNotificationDropdownOpen = false;
  }

  removeSelectedNotifications(): void {
    this.notifications = this.notifications.filter((_, i) => !this.selectedNotifications.includes(i));
    this.selectedNotifications = [];
    this.isNotificationActionsOpen = false;
  }

  get unreadNotifications(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  private closeOtherDropdowns(except: string): void {
    if (except !== 'notification') this.isNotificationDropdownOpen = false;
    if (except !== 'language') this.isLanguageDropdownOpen = false;
    if (except !== 'theme') this.isThemeDropdownOpen = false;
    if (except !== 'user') this.isUserDropdownOpen = false;
    if (except !== 'search') this.isSearchDropdownOpen = false;
    if (except !== 'sidebar') {
      this.isSidebarOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.topbar-head-dropdown') &&
      !target.closest('.app-search') &&
      !target.closest('.vertical-menu-btn')) {
      this.isNotificationDropdownOpen = false;
      this.isLanguageDropdownOpen = false;
      this.isThemeDropdownOpen = false;
      this.isUserDropdownOpen = false;
      this.isSearchDropdownOpen = false;
      this.isSidebarOpen = false;
    }
  }

  toggleBackToTop = () => {
    const btn = document.getElementById('back-to-top');
    if (btn) btn.style.display = window.scrollY > 200 ? 'block' : 'none';
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  logout(): void {
    console.log('[HEADER] Logging out...');
    this.authService.logout();
    // La navigation vers /login est maintenant gérée dans authService.logout()
  }

  get userRoleLabel(): string {
    switch (this.userRole) {
      case 'DRH': return 'HR Manager';
      case 'CHEF': return 'Manager';
      case 'CONCIERGE': return 'Concierge';
      case 'EMPLOYE': return 'Employee';
      default: return '';
    }
  }

  protected readonly Role = Role;


  activeTab = 'demandes'; // onglet par défaut

  demandes = [
    { etat: 'Demande de congé', statut: 'Validé' },
    { etat: 'Autorisation', statut: 'Refusé' },
    { etat: 'Ordre de mission', statut: 'En cours' }
  ];
}
