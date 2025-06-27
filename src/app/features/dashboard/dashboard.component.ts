import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { DashboardService } from '../../core/services/dashboard/dashboard.service';
import { UserService } from '../../core/services/user/user.service';
import { TransactionService } from '../../core/services/transaction/transaction.service';
import { DashboardOverview, CategorySummary, UserProfile, Transaction } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  userProfile: UserProfile | null = null;
  dashboardData: DashboardOverview | null = null;
  categorySummary: CategorySummary[] = [];
  recentTransactions: Transaction[] = [];
  quickActions: any[] = [];
  isLoading = true;
  
  private destroy$ = new Subject<void>();

  constructor(
    private dashboardService: DashboardService,
    private userService: UserService,
    private transactionService: TransactionService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
    this.loadDashboardData();
    this.quickActions = this.dashboardService.getQuickActions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserProfile() {
    this.userService.userProfile$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(profile => {
      this.userProfile = profile;
    });
  }

  private loadDashboardData() {
    this.isLoading = true;
    
    forkJoin({
      overview: this.dashboardService.getOverview(),
      categorySummary: this.dashboardService.getSummaryByCategory(),
      recentTransactions: this.transactionService.getTransactions()
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.dashboardData = data.overview;
        this.categorySummary = data.categorySummary;
        this.recentTransactions = data.recentTransactions.slice(0, 5); // Show only 5 recent
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
        // Use mock data for development
        this.loadMockData();
      }
    });
  }

  private loadMockData() {
    this.dashboardData = {
      totalIncome: 15000000,
      totalExpense: 8500000,
      balance: 6500000,
      budgetUsage: 65,
      recentTransactions: []
    };

    this.categorySummary = [
      { categoryId: '1', categoryName: 'Ăn uống', totalAmount: 2500000, budgetAmount: 3000000, percentage: 83 },
      { categoryId: '2', categoryName: 'Di chuyển', totalAmount: 1200000, budgetAmount: 1500000, percentage: 80 },
      { categoryId: '3', categoryName: 'Giải trí', totalAmount: 800000, budgetAmount: 1000000, percentage: 80 },
      { categoryId: '4', categoryName: 'Tiện ích', totalAmount: 1500000, budgetAmount: 2000000, percentage: 75 },
      { categoryId: '5', categoryName: 'Mua sắm', totalAmount: 2000000, budgetAmount: 2500000, percentage: 80 }
    ];

    this.recentTransactions = [
      { 
        id: '1', 
        categoryId: '1', 
        amount: -150000, 
        date: '2024-01-15T00:00:00Z', 
        note: 'Siêu thị Co.op Mart',
        category: { id: '1', name: 'Ăn uống', icon: '🍽️', type: 1, period: 2, isDefault: false, level: 0 }
      },
      { 
        id: '2', 
        categoryId: '2', 
        amount: -50000, 
        date: '2024-01-14T00:00:00Z', 
        note: 'Grab bike',
        category: { id: '2', name: 'Di chuyển', icon: '🚗', type: 1, period: 2, isDefault: false, level: 0 }
      },
      { 
        id: '3', 
        categoryId: '3', 
        amount: -300000, 
        date: '2024-01-13T00:00:00Z', 
        note: 'Xem phim',
        category: { id: '3', name: 'Giải trí', icon: '🎬', type: 1, period: 2, isDefault: false, level: 0 }
      },
      { 
        id: '4', 
        categoryId: '4', 
        amount: -800000, 
        date: '2024-01-12T00:00:00Z', 
        note: 'Tiền điện',
        category: { id: '4', name: 'Tiện ích', icon: '⚡', type: 1, period: 2, isDefault: false, level: 0 }
      },
      { 
        id: '5', 
        categoryId: '1', 
        amount: -200000, 
        date: '2024-01-11T00:00:00Z', 
        note: 'Nhà hàng',
        category: { id: '1', name: 'Ăn uống', icon: '🍽️', type: 1, period: 2, isDefault: false, level: 0 }
      }
    ];
  }

  getUserDisplayName(): string {
    return this.userService.getUserDisplayName(this.userProfile);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  getMaxCategoryAmount(): number {
    if (this.categorySummary.length === 0) return 0;
    return Math.max(...this.categorySummary.map(cat => cat.totalAmount));
  }

  getCategoryBarHeight(amount: number): string {
    const maxAmount = this.getMaxCategoryAmount();
    if (maxAmount === 0) return '0%';
    return `${Math.round((amount / maxAmount) * 100)}%`;
  }

  refreshData() {
    this.loadDashboardData();
  }
}
