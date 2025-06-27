import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { DebtLoanService } from '../../../core/services/debt-loan/debt-loan.service';
import { DebtAndLoan } from '../../../core/models';

@Component({
  selector: 'app-debt-loan-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './debt-loan-list.component.html',
  styleUrl: './debt-loan-list.component.css'
})
export class DebtLoanListComponent implements OnInit {
  debtLoans: DebtAndLoan[] = [];
  isLoading = false;

  constructor(private debtLoanService: DebtLoanService) {}

  ngOnInit() {
    this.loadDebtLoans();
  }

  loadDebtLoans() {
    this.isLoading = true;
    this.debtLoanService.getDebtAndLoans().subscribe({
      next: (debtLoans) => {
        this.debtLoans = debtLoans;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading debt loans:', error);
        this.isLoading = false;
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('vi-VN');
  }
} 