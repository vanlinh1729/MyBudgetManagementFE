import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { TransactionService } from '../../../core/services/transaction/transaction.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { Transaction, Category, FilterParams } from '../../../core/models';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css'
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  categories: Category[] = [];
  filteredTransactions: Transaction[] = [];
  
  // Make Math available in template
  Math = Math;
  
  // Filters
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();
  selectedCategoryId: string = '';
  searchTerm: string = '';
  
  // UI State
  isLoading = false;
  showFilters = false;
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadTransactions();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadTransactions() {
    this.isLoading = true;
    const params: FilterParams = {
      year: this.selectedYear,
      month: this.selectedMonth
    };

    this.transactionService.getTransactions(params).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    let filtered = [...this.transactions];

    // Filter by category
    if (this.selectedCategoryId) {
      filtered = filtered.filter(t => t.categoryId === this.selectedCategoryId);
    }

    // Filter by search term
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.note?.toLowerCase().includes(searchLower) ||
        t.category?.name?.toLowerCase().includes(searchLower)
      );
    }

    this.filteredTransactions = filtered;
    this.totalItems = filtered.length;
  }

  onFilterChange() {
    this.loadTransactions();
  }

  onSearchChange() {
    this.applyFilters();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  deleteTransaction(id: string) {
    if (confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) {
      this.transactionService.deleteTransaction(id).subscribe({
        next: () => {
          this.loadTransactions();
        },
        error: (error) => {
          console.error('Error deleting transaction:', error);
        }
      });
    }
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

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category?.name || 'Không xác định';
  }

  getTransactionTypeClass(transaction: Transaction): string {
    const category = this.categories.find(c => c.id === transaction.categoryId);
    if (!category) return 'text-gray-600';
    
    switch (category.type) {
      case 0: return 'text-green-600'; // Income
      case 1: return 'text-red-600';   // Expense
      case 2: return 'text-blue-600';  // Transfer
      default: return 'text-gray-600';
    }
  }

  get paginatedTransactions(): Transaction[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredTransactions.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
} 