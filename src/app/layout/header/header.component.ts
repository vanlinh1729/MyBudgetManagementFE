import { Component, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';
import { UserService } from '../../core/services/user/user.service';
import { UserProfile } from '../../core/models';

@Component({
  selector: 'app-header',
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() toggleSidebar = new EventEmitter<void>();
  
  showUserMenu = false;
  showQuickNav = false;
  showNotifications = false;
  
  userProfile: UserProfile | null = null;
  searchQuery = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Subscribe to user profile changes (includes avatar updates)
    this.userService.userProfile$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(profile => {
      console.log('Header received profile update:', profile);
      this.userProfile = profile;
    });

    // Force load user profile to ensure we have latest data
    this.userService.forceRefreshProfile().subscribe({
      next: (profile) => {
        console.log('Header force refreshed profile:', profile);
      },
      error: (error) => {
        console.error('Header failed to load profile:', error);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchBlur() {
    // Delay hiding to allow click events on menu items
    setTimeout(() => {
      this.showQuickNav = false;
    }, 200);
  }

  navigateToPage(path: string) {
    this.showQuickNav = false;
    this.searchQuery = '';
    this.router.navigate([path]);
  }

  clearSearch() {
    this.searchQuery = '';
    this.showQuickNav = false;
  }

  // Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    
    // Close quick nav
    const searchContainer = target.closest('.search-container');
    if (!searchContainer) {
      this.showQuickNav = false;
    }
    
    // Close user menu - chỉ đóng khi click bên ngoài user menu container
    const userMenuContainer = target.closest('.user-menu-container');
    if (!userMenuContainer && this.showUserMenu) {
      this.showUserMenu = false;
    }
    
    // Close notifications
    const notificationContainer = target.closest('.notification-container');
    if (!notificationContainer) {
      this.showNotifications = false;
    }
  }

  toggleMobileMenu() {
    this.toggleSidebar.emit();
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false; // Close other dropdowns
    this.showQuickNav = false; // Close quick nav
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false; // Close other dropdowns
    this.showQuickNav = false; // Close quick nav
  }

  getUserAvatarUrl(): string {
    return this.userService.getUserAvatar(this.userProfile);
  }

  getUserDisplayName(): string {
    return this.userService.getUserDisplayName(this.userProfile);
  }

  getUserEmail(): string {
    return this.userProfile?.email || 'user@example.com';
  }

  navigateToProfile() {
    this.showUserMenu = false;
    this.router.navigate(['/profile']);
  }

  navigateToSettings() {
    this.showUserMenu = false;
    this.router.navigate(['/profile'], { fragment: 'settings' });
  }

  logout() {
    this.showUserMenu = false;
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
