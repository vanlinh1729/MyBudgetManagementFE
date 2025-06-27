import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  { path: "", component: HomeComponent },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.authRoutes),
  },
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      }
    ]
  },
  {
    path: 'profile',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
      }
    ]
  },
  {
    path: 'transactions',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/transactions/transaction-list/transaction-list.component').then(m => m.TransactionListComponent),
      },
      {
        path: 'add',
        loadComponent: () => import('./features/transactions/transaction-form/transaction-form.component').then(m => m.TransactionFormComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./features/transactions/transaction-form/transaction-form.component').then(m => m.TransactionFormComponent),
      }
    ]
  },
  {
    path: 'categories',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/categories/category-list/category-list.component').then(m => m.CategoryListComponent),
      },
      {
        path: 'add',
        loadComponent: () => import('./features/categories/category-form/category-form.component').then(m => m.CategoryFormComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./features/categories/category-form/category-form.component').then(m => m.CategoryFormComponent),
      }
    ]
  },
  {
    path: 'debt',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/debt-loan/debt-loan-list/debt-loan-list.component').then(m => m.DebtLoanListComponent),
      },
      {
        path: 'add',
        loadComponent: () => import('./features/debt-loan/debt-loan-form/debt-loan-form.component').then(m => m.DebtLoanFormComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./features/debt-loan/debt-loan-form/debt-loan-form.component').then(m => m.DebtLoanFormComponent),
      },
      {
        path: ':id/payments',
        loadComponent: () => import('./features/debt-loan/payment-history/payment-history.component').then(m => m.PaymentHistoryComponent),
      }
    ]
  },
  {
    path: 'reports',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent),
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
