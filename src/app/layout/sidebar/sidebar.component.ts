import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Subject, takeUntil, filter } from 'rxjs';
import { UserService } from '../../core/services/user/user.service';
import { UserProfile } from '../../core/models';

interface MenuItem {
  path: string;
  icon: string;
  label: string;
  badge?: number;
  isActive?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() closeSidebarEvent = new EventEmitter<void>();

  userProfile: UserProfile | null = null;
  currentPath = '';
  
  private destroy$ = new Subject<void>();

  menuItems: MenuItem[] = [
    {
      path: '/dashboard',
      icon: 'layout-dashboard',
      label: 'Dashboard'
    },
    {
      path: '/transactions',
      icon: 'receipt',
      label: 'Giao dịch'
    },
    {
      path: '/categories',
      icon: 'folder-open',
      label: 'Danh mục & Ngân sách'
    },
    {
      path: '/debt',
      icon: 'credit-card',
      label: 'Nợ & Cho vay'
    },
    {
      path: '/reports',
      icon: 'chart-line',
      label: 'Báo cáo'
    },
    {
      path: '/profile',
      icon: 'user',
      label: 'Hồ sơ cá nhân'
    }
  ];

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to user profile changes
    this.userService.userProfile$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(profile => {
      this.userProfile = profile;
    });

    // Load user profile
    this.userService.forceRefreshProfile().subscribe();

    // Track current route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      this.currentPath = event.url;
      this.updateActiveStates();
    });

    // Set initial active state
    this.currentPath = this.router.url;
    this.updateActiveStates();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateActiveStates() {
    this.menuItems.forEach(item => {
      item.isActive = this.currentPath.startsWith(item.path);
    });
  }

  closeSidebar() {
    this.closeSidebarEvent.emit();
  }

  navigateToItem(item: MenuItem) {
    this.router.navigate([item.path]);
    this.closeSidebar(); // Close mobile sidebar after navigation
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

  getMenuItemClass(item: MenuItem): string {
    const baseClass = 'w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded-lg transition-colors';
    const activeClass = 'bg-slate-900 text-white';
    const inactiveClass = 'text-gray-700 hover:bg-gray-100';
    
    return item.isActive ? `${baseClass} ${activeClass}` : `${baseClass} ${inactiveClass}`;
  }

  getIconClass(item: MenuItem): string {
    return item.isActive ? 'text-blue-600' : 'text-[#4e7397] group-hover:text-[#0e141b]';
  }

  getTextClass(item: MenuItem): string {
    return item.isActive ? 'text-blue-700 font-semibold' : 'text-[#0e141b] font-medium group-hover:text-[#0e141b]';
  }
} 