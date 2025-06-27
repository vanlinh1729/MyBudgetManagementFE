import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { CategoryService } from '../../../core/services/category/category.service';
import { Category, CategoryType, CategoryLevel, Period } from '../../../core/models';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  
  // Filters
  selectedType: CategoryType | '' = '';
  selectedLevel: CategoryLevel | '' = '';
  searchTerm: string = '';
  
  // UI State
  isLoading = false;
  showFilters = false;

  // Enums for template
  CategoryType = CategoryType;
  CategoryLevel = CategoryLevel;
  Period = Period;

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    let filtered = [...this.categories];

    // Filter by type
    if (this.selectedType !== '') {
      filtered = filtered.filter(c => c.type === this.selectedType);
    }

    // Filter by level
    if (this.selectedLevel !== '') {
      filtered = filtered.filter(c => c.level === this.selectedLevel);
    }

    // Filter by search term
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchLower)
      );
    }

    this.filteredCategories = filtered;
  }

  onFilterChange() {
    this.applyFilters();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  deleteCategory(id: string) {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error deleting category:', error);
        }
      });
    }
  }

  getCategoryTypeLabel(type: CategoryType): string {
    switch (type) {
      case CategoryType.Income: return 'Thu nhập';
      case CategoryType.Expense: return 'Chi tiêu';
      case CategoryType.Transfer: return 'Chuyển khoản';
      default: return 'Không xác định';
    }
  }

  getCategoryTypeClass(type: CategoryType): string {
    switch (type) {
      case CategoryType.Income: return 'bg-green-100 text-green-800';
      case CategoryType.Expense: return 'bg-red-100 text-red-800';
      case CategoryType.Transfer: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getCategoryLevelLabel(level: CategoryLevel): string {
    switch (level) {
      case CategoryLevel.Parent: return 'Cha';
      case CategoryLevel.Child: return 'Con';
      default: return 'Không xác định';
    }
  }

  getPeriodLabel(period: Period): string {
    switch (period) {
      case Period.Daily: return 'Hàng ngày';
      case Period.Weekly: return 'Hàng tuần';
      case Period.Monthly: return 'Hàng tháng';
      case Period.Yearly: return 'Hàng năm';
      default: return 'Không xác định';
    }
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return 'Không giới hạn';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }
} 