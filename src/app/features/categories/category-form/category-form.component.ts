import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CategoryService } from '../../../core/services/category/category.service';
import { CreateCategoryCommand, UpdateCategoryCommand, CategoryType, CategoryLevel, Period } from '../../../core/models';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css'
})
export class CategoryFormComponent implements OnInit {
  categoryForm!: FormGroup;
  isEditMode = false;
  categoryId: string | null = null;
  isLoading = false;
  isSubmitting = false;

  // Enums for template
  CategoryType = CategoryType;
  CategoryLevel = CategoryLevel;
  Period = Period;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.checkEditMode();
  }

  initForm() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      icon: ['💰', Validators.required],
      budget: [null],
      type: [CategoryType.Expense, Validators.required],
      period: [Period.Monthly, Validators.required],
      isDefault: [false],
      level: [CategoryLevel.Parent, Validators.required]
    });
  }

  checkEditMode() {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    if (this.categoryId) {
      this.isEditMode = true;
      this.loadCategory();
    }
  }

  loadCategory() {
    if (!this.categoryId) return;
    
    this.isLoading = true;
    this.categoryService.getCategoryById(this.categoryId).subscribe({
      next: (category) => {
        this.categoryForm.patchValue({
          name: category.name,
          icon: category.icon,
          budget: category.budget,
          type: category.type,
          period: category.period,
          isDefault: category.isDefault,
          level: category.level
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading category:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      this.isSubmitting = true;
      
      const formValue = this.categoryForm.value;

      if (this.isEditMode && this.categoryId) {
        const updateCommand: UpdateCategoryCommand = {
          id: this.categoryId,
          name: formValue.name,
          icon: formValue.icon,
          budget: formValue.budget ? parseFloat(formValue.budget) : undefined,
          level: parseInt(formValue.level),
          period: parseInt(formValue.period)
        };

        this.categoryService.updateCategory(this.categoryId, updateCommand).subscribe({
          next: () => {
            this.router.navigate(['/categories']);
          },
          error: (error) => {
            console.error('Error updating category:', error);
            this.isSubmitting = false;
          }
        });
      } else {
        const createCommand: CreateCategoryCommand = {
          name: formValue.name,
          icon: formValue.icon,
          budget: formValue.budget ? parseFloat(formValue.budget) : undefined,
          type: parseInt(formValue.type),
          period: parseInt(formValue.period),
          isDefault: formValue.isDefault,
          level: parseInt(formValue.level)
        };

        this.categoryService.createCategory(createCommand).subscribe({
          next: () => {
            this.router.navigate(['/categories']);
          },
          error: (error) => {
            console.error('Error creating category:', error);
            this.isSubmitting = false;
          }
        });
      }
    }
  }

  onCancel() {
    this.router.navigate(['/categories']);
  }

  getCategoryTypeLabel(type: CategoryType): string {
    switch (type) {
      case CategoryType.Income: return 'Thu nhập';
      case CategoryType.Expense: return 'Chi tiêu';
      case CategoryType.Transfer: return 'Chuyển khoản';
      default: return 'Không xác định';
    }
  }

  getCategoryLevelLabel(level: CategoryLevel): string {
    switch (level) {
      case CategoryLevel.Parent: return 'Danh mục cha';
      case CategoryLevel.Child: return 'Danh mục con';
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
} 