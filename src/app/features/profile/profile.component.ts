import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../core/services/user/user.service';
import { UserProfile, Gender, Currencies } from '../../core/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  userProfile: UserProfile | null = null;
  isLoading = false;
  isUpdatingProfile = false;
  isChangingPassword = false;
  
  successMessage = '';
  errorMessage = '';
  passwordSuccessMessage = '';
  passwordErrorMessage = '';
  
  activeTab: 'profile' | 'password' | 'security' = 'profile';
  
  // Avatar upload
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isUploadingAvatar = false;
  
  // Enums for template
  Gender = Gender;
  Currencies = Currencies;
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.initializeForms();
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms() {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.pattern(/^[0-9]{10,11}$/)]],
      dateOfBirth: [''],
      gender: [Gender.Male],
      currency: [Currencies.VND]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  private loadUserProfile() {
    this.isLoading = true;
    
    this.userService.userProfile$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(profile => {
      this.userProfile = profile;
      if (profile) {
        this.populateForm(profile);
      }
      this.isLoading = false;
    });

    this.userService.loadUserProfile();
  }

  private populateForm(profile: UserProfile) {
    this.profileForm.patchValue({
      fullName: profile.fullName || '',
      email: profile.email || '',
      phoneNumber: profile.phoneNumber || '',
      dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
      gender: profile.gender ?? Gender.Male,
      currency: profile.currency ?? Currencies.VND
    });
  }

  // Tab switching
  switchTab(tab: 'profile' | 'password' | 'security') {
    this.activeTab = tab;
    this.clearMessages();
  }

  private clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
    this.passwordSuccessMessage = '';
    this.passwordErrorMessage = '';
  }

  // Avatar handling
  onAvatarSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        this.errorMessage = 'Kích thước ảnh không được vượt quá 5MB';
        return;
      }

      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Vui lòng chọn file ảnh hợp lệ';
        return;
      }

      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      
      this.clearMessages();
    }
  }

  removeAvatar() {
    this.selectedFile = null;
    this.previewUrl = null;
    // Reset file input
    const fileInput = document.getElementById('avatar-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Profile update
  onSubmitProfile() {
    if (this.profileForm.valid) {
      this.isUpdatingProfile = true;
      this.clearMessages();

      const formValue = this.profileForm.value;
      const updateData: Partial<UserProfile> = {
        fullName: formValue.fullName,
        phoneNumber: formValue.phoneNumber || undefined,
        dateOfBirth: formValue.dateOfBirth ? new Date(formValue.dateOfBirth).toISOString() : undefined,
        gender: parseInt(formValue.gender),
        currency: parseInt(formValue.currency)
      };

      // Use new method that handles avatar upload
      this.userService.updateUserProfileWithAvatar(updateData, this.selectedFile || undefined).subscribe({
        next: (updatedProfile) => {
          console.log('Profile update successful:', updatedProfile);
          this.userProfile = updatedProfile;
          this.successMessage = 'Cập nhật thông tin thành công!';
          this.isUpdatingProfile = false;
          
          // Clear selected file after successful upload
          if (this.selectedFile) {
            this.selectedFile = null;
            this.previewUrl = null;
            const fileInput = document.getElementById('avatar-upload') as HTMLInputElement;
            if (fileInput) {
              fileInput.value = '';
            }
          }
        },
        error: (error) => {
          this.errorMessage = error.message || 'Có lỗi xảy ra khi cập nhật thông tin';
          this.isUpdatingProfile = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.profileForm);
    }
  }

  // Upload avatar separately
  uploadAvatarOnly() {
    if (!this.selectedFile) {
      this.errorMessage = 'Vui lòng chọn ảnh trước khi tải lên';
      return;
    }

    console.log('Uploading file:', this.selectedFile.name, 'Size:', this.selectedFile.size, 'Type:', this.selectedFile.type);

    this.isUploadingAvatar = true;
    this.clearMessages();

    this.userService.uploadAvatar(this.selectedFile).subscribe({
      next: (result) => {
        console.log('Avatar upload successful:', result);
        
        // Force refresh profile to get updated avatar
        this.userService.forceRefreshProfile().subscribe({
          next: (updatedProfile) => {
            console.log('Profile refreshed with new avatar:', updatedProfile);
            this.userProfile = updatedProfile;
            this.successMessage = 'Cập nhật ảnh đại diện thành công!';
            this.isUploadingAvatar = false;
            
            // Clear selected file
            this.selectedFile = null;
            this.previewUrl = null;
            const fileInput = document.getElementById('avatar-upload') as HTMLInputElement;
            if (fileInput) {
              fileInput.value = '';
            }
          },
          error: (error) => {
            console.error('Failed to refresh profile:', error);
            this.successMessage = 'Upload thành công nhưng có lỗi khi cập nhật hiển thị';
            this.isUploadingAvatar = false;
          }
        });
      },
      error: (error) => {
        console.error('Upload error:', error);
        this.errorMessage = error.message || 'Có lỗi xảy ra khi tải ảnh lên';
        this.isUploadingAvatar = false;
      }
    });
  }

  // Password change
  onSubmitPassword() {
    if (this.passwordForm.valid) {
      this.isChangingPassword = true;
      this.passwordSuccessMessage = '';
      this.passwordErrorMessage = '';

      const formValue = this.passwordForm.value;
      const passwordData = {
        currentPassword: formValue.currentPassword,
        newPassword: formValue.newPassword,
        confirmPassword: formValue.confirmPassword
      };

      this.userService.changePassword(passwordData).subscribe({
        next: () => {
          this.passwordSuccessMessage = 'Đổi mật khẩu thành công!';
          this.passwordForm.reset();
          this.isChangingPassword = false;
        },
        error: (error) => {
          this.passwordErrorMessage = error.message || 'Có lỗi xảy ra khi đổi mật khẩu';
          this.isChangingPassword = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.passwordForm);
    }
  }

  // Helper methods
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(formGroup: FormGroup, fieldName: string): boolean {
    const field = formGroup.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(formGroup: FormGroup, fieldName: string): string {
    const field = formGroup.get(fieldName);
    if (field?.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} là bắt buộc`;
      if (field.errors['email']) return 'Email không hợp lệ';
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} phải có ít nhất ${field.errors['minlength'].requiredLength} ký tự`;
      if (field.errors['pattern']) return `${this.getFieldLabel(fieldName)} không hợp lệ`;
      if (field.errors['passwordMismatch']) return 'Mật khẩu xác nhận không khớp';
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      fullName: 'Họ và tên',
      email: 'Email',
      phoneNumber: 'Số điện thoại',
      dateOfBirth: 'Ngày sinh',
      currentPassword: 'Mật khẩu hiện tại',
      newPassword: 'Mật khẩu mới',
      confirmPassword: 'Xác nhận mật khẩu'
    };
    return labels[fieldName] || fieldName;
  }

  getUserAvatar(): string {
    // Show preview if available
    if (this.previewUrl) {
      return this.previewUrl;
    }
    return this.userService.getUserAvatar(this.userProfile);
  }

  getGenderLabel(gender: Gender): string {
    return this.userService.getGenderLabel(gender);
  }

  getCurrencyLabel(currency: Currencies): string {
    return this.userService.getCurrencyLabel(currency);
  }

  // Security actions
  deleteAccount() {
    if (confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.')) {
      // Implement account deletion
      const password = prompt('Nhập mật khẩu để xác nhận xóa tài khoản:');
      if (password) {
        const deleteData = {
          password: password,
          confirmationText: 'DELETE'
        };
        
        this.userService.deleteAccount(deleteData).subscribe({
          next: () => {
            alert('Tài khoản đã được xóa thành công');
            this.router.navigate(['/auth/login']);
          },
          error: (error) => {
            alert('Không thể xóa tài khoản: ' + error.message);
          }
        });
      }
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
} 