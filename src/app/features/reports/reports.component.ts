import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { DashboardService } from '../../core/services/dashboard/dashboard.service';
import { CategorySummary } from '../../core/models';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  categorySummary: CategorySummary[] = [];
  isLoading = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadCategorySummary();
  }

  loadCategorySummary() {
    this.isLoading = true;
    this.dashboardService.getSummaryByCategory().subscribe({
      next: (summary) => {
        this.categorySummary = summary;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading category summary:', error);
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

  getTotalIncome(): number {
    return this.categorySummary
      .filter(c => c.categoryName.includes('Thu'))
      .reduce((sum, c) => sum + c.totalAmount, 0);
  }

  getTotalExpense(): number {
    return this.categorySummary
      .filter(c => !c.categoryName.includes('Thu'))
      .reduce((sum, c) => sum + c.totalAmount, 0);
  }

  getBalance(): number {
    return this.getTotalIncome() - this.getTotalExpense();
  }
} 