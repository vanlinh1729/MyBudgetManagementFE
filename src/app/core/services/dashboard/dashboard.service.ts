import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { DashboardOverview, CategorySummary, SearchResult } from '../../models';

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  route: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_BASE = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get dashboard overview
  getOverview(): Observable<DashboardOverview> {
    return this.http.get<DashboardOverview>(`${this.API_BASE}/dashboard/overview`).pipe(
      catchError(this.handleError)
    );
  }

  // Get category summary
  getSummaryByCategory(): Observable<CategorySummary[]> {
    return this.http.get<CategorySummary[]>(`${this.API_BASE}/dashboard/summary-by-category`).pipe(
      catchError(this.handleError)
    );
  }

  // Search functionality
  search(query: string): Observable<SearchResult[]> {
    if (!query.trim()) {
      return of([]);
    }

    // Mock search implementation - replace with actual API call
    const mockResults: SearchResult[] = [
      {
        type: 'transaction',
        id: '1',
        title: 'Siêu thị Co.op Mart',
        subtitle: 'Ăn uống',
        amount: -150000
      },
      {
        type: 'category',
        id: '2',
        title: 'Ăn uống',
        subtitle: 'Danh mục chi tiêu'
      },
      {
        type: 'debt',
        id: '3',
        title: 'Nợ Nguyễn Văn A',
        subtitle: 'Nợ phải trả',
        amount: 500000
      }
    ];

    return of(mockResults.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase()))
    )).pipe(
      catchError(this.handleError)
    );
  }

  // Get quick actions
  getQuickActions(): QuickAction[] {
    return [
      {
        id: 'add-income',
        label: 'Thêm thu nhập',
        icon: 'circle-plus',
        color: 'bg-green-100 text-green-700',
        route: '/transactions/add',
        description: 'Ghi nhận khoản thu nhập mới'
      },
      {
        id: 'add-expense',
        label: 'Thêm chi tiêu',
        icon: 'circle-minus',
        color: 'bg-red-100 text-red-700',
        route: '/transactions/add',
        description: 'Ghi nhận khoản chi tiêu mới'
      },
      {
        id: 'add-category',
        label: 'Danh mục mới',
        icon: 'folder-plus',
        color: 'bg-blue-100 text-blue-700',
        route: '/categories/add',
        description: 'Tạo danh mục thu chi mới'
      },
      {
        id: 'view-reports',
        label: 'Báo cáo',
        icon: 'chart-bar-big',
        color: 'bg-indigo-100 text-indigo-700',
        route: '/reports',
        description: 'Xem báo cáo tài chính chi tiết'
      }
    ];
  }

  // Get spending insights
  getSpendingInsights(): Observable<any> {
    // Mock implementation - replace with actual API call
    return of({
      topSpendingCategory: 'Ăn uống',
      avgDailySpending: 250000,
      budgetStatus: 'warning', // 'good', 'warning', 'danger'
      savingsRate: 0.35,
      monthlyTrend: 'increasing'
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get financial goals progress
  getGoalsProgress(): Observable<any[]> {
    // Mock implementation - replace with actual API call
    return of([
      {
        id: '1',
        name: 'Mua xe máy',
        targetAmount: 50000000,
        currentAmount: 15000000,
        deadline: '2024-12-31',
        progress: 30
      },
      {
        id: '2',
        name: 'Du học',
        targetAmount: 200000000,
        currentAmount: 45000000,
        deadline: '2025-08-01',
        progress: 22.5
      }
    ]).pipe(
      catchError(this.handleError)
    );
  }

  // Get upcoming bills/payments
  getUpcomingPayments(): Observable<any[]> {
    // Mock implementation - replace with actual API call
    return of([
      {
        id: '1',
        name: 'Tiền điện',
        amount: 800000,
        dueDate: '2024-01-25',
        category: 'Tiện ích',
        status: 'pending'
      },
      {
        id: '2',
        name: 'Tiền nhà',
        amount: 3000000,
        dueDate: '2024-01-30',
        category: 'Nhà ở',
        status: 'pending'
      }
    ]).pipe(
      catchError(this.handleError)
    );
  }

  // Get budget utilization by category
  getBudgetUtilization(): Observable<any[]> {
    return this.getSummaryByCategory().pipe(
      map(categories => 
        categories.map(cat => ({
          ...cat,
          utilizationRate: cat.budgetAmount ? (cat.totalAmount / cat.budgetAmount) * 100 : 0,
          status: this.getBudgetStatus(cat.totalAmount, cat.budgetAmount || 0)
        }))
      ),
      catchError(this.handleError)
    );
  }

  // Helper method to determine budget status
  private getBudgetStatus(spent: number, budget: number): 'good' | 'warning' | 'danger' {
    if (budget === 0) return 'good';
    const percentage = (spent / budget) * 100;
    
    if (percentage < 70) return 'good';
    if (percentage < 90) return 'warning';
    return 'danger';
  }

  // Error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Đã xảy ra lỗi không xác định';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Lỗi: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Dữ liệu không hợp lệ';
          break;
        case 401:
          errorMessage = 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại';
          break;
        case 403:
          errorMessage = 'Không có quyền truy cập';
          break;
        case 404:
          errorMessage = 'Không tìm thấy dữ liệu';
          break;
        case 500:
          errorMessage = 'Lỗi máy chủ nội bộ';
          break;
        default:
          errorMessage = `Lỗi: ${error.status} - ${error.message}`;
      }
    }
    
    console.error('Dashboard Service Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 