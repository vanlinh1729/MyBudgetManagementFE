import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TransactionService } from '../../../core/services/transaction/transaction.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { FileService } from '../../../core/services/file/file.service';
import { Category, CreateTransactionCommand, UpdateTransactionCommand, CategoryType } from '../../../core/models';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.css'
})
export class TransactionFormComponent implements OnInit {
  transactionForm!: FormGroup;
  categories: Category[] = [];
  isEditMode = false;
  transactionId: string | null = null;
  isLoading = false;
  isSubmitting = false;
  
  // Image upload
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isUploadingImage = false;
  existingImageUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private fileService: FileService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadCategories();
    this.checkEditMode();
  }

  initForm() {
    this.transactionForm = this.fb.group({
      categoryId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      note: [''],
      image: ['']
    });
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

  checkEditMode() {
    this.transactionId = this.route.snapshot.paramMap.get('id');
    if (this.transactionId) {
      this.isEditMode = true;
      this.loadTransaction();
    }
  }

  loadTransaction() {
    if (!this.transactionId) return;
    
    this.isLoading = true;
    this.transactionService.getTransactionById(this.transactionId).subscribe({
      next: (transaction) => {
        this.transactionForm.patchValue({
          categoryId: transaction.categoryId,
          amount: transaction.amount,
          date: new Date(transaction.date).toISOString().split('T')[0],
          note: transaction.note,
          image: transaction.image
        });
        
        // Set existing image URL for preview
        this.existingImageUrl = transaction.image || null;
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading transaction:', error);
        this.isLoading = false;
      }
    });
  }

  // Image handling
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('Kích thước ảnh không được vượt quá 10MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh hợp lệ');
        return;
      }

      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.previewUrl = null;
    this.existingImageUrl = null;
    this.transactionForm.patchValue({ image: '' });
    
    // Reset file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  async onSubmit() {
    if (this.transactionForm.valid) {
      this.isSubmitting = true;
      
      try {
        const formValue = this.transactionForm.value;
        const dateValue = new Date(formValue.date).toISOString();
        
        // Upload image first if selected
        let imageUrl = this.existingImageUrl;
        if (this.selectedFile) {
          this.isUploadingImage = true;
          const uploadResult = await this.fileService.uploadFile(this.selectedFile, 'transactions').toPromise();
          imageUrl = uploadResult?.url || null;
          this.isUploadingImage = false;
        }

        if (this.isEditMode && this.transactionId) {
          const updateCommand: UpdateTransactionCommand = {
            id: this.transactionId,
            categoryId: formValue.categoryId,
            amount: parseFloat(formValue.amount),
            date: dateValue,
            note: formValue.note || undefined,
            image: imageUrl || undefined
          };

          this.transactionService.updateTransaction(this.transactionId, updateCommand).subscribe({
            next: () => {
              this.router.navigate(['/transactions']);
            },
            error: (error) => {
              console.error('Error updating transaction:', error);
              this.isSubmitting = false;
            }
          });
        } else {
          const createCommand: CreateTransactionCommand = {
            categoryId: formValue.categoryId,
            amount: parseFloat(formValue.amount),
            date: dateValue,
            note: formValue.note || undefined,
            image: imageUrl || undefined
          };

          this.transactionService.createTransaction(createCommand).subscribe({
            next: () => {
              this.router.navigate(['/transactions']);
            },
            error: (error) => {
              console.error('Error creating transaction:', error);
              this.isSubmitting = false;
            }
          });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        this.isSubmitting = false;
        this.isUploadingImage = false;
        alert('Có lỗi xảy ra khi tải ảnh lên');
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  // Get image display URL
  getImageUrl(): string | null {
    if (this.previewUrl) return this.previewUrl;
    if (this.existingImageUrl) return this.existingImageUrl;
    return null;
  }

  markFormGroupTouched() {
    Object.keys(this.transactionForm.controls).forEach(key => {
      const control = this.transactionForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel() {
    this.router.navigate(['/transactions']);
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
      case CategoryType.Income: return 'text-green-600 bg-green-50';
      case CategoryType.Expense: return 'text-red-600 bg-red-50';
      case CategoryType.Transfer: return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  }

  // Form validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.transactionForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.transactionForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} là bắt buộc`;
      if (field.errors['min']) return `${this.getFieldLabel(fieldName)} phải lớn hơn 0`;
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      categoryId: 'Danh mục',
      amount: 'Số tiền',
      date: 'Ngày',
      note: 'Ghi chú'
    };
    return labels[fieldName] || fieldName;
  }
} 