import { Component, OnInit, ViewEncapsulation } from "@angular/core"
import { FormBuilder, Validators, FormGroup } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { ReactiveFormsModule } from '@angular/forms'; // ✅ Import this
import { CommonModule } from '@angular/common'; // optional but useful
import { AuthService } from "../../../core/services/auth/auth.service"
import { LucideAngularModule } from 'lucide-angular';

@Component({
  encapsulation: ViewEncapsulation.None,

  selector: "app-login",
  templateUrl: "./login.component.html",
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule], // ✅ Add ReactiveFormsModule here
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup
  isLoading = false
  showPassword = false
  errorMessage = ""
  successMessage = ""

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initializeForm()
  }

  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
    })
  }

  get f() {
    return this.loginForm.controls
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched()
      return
    }

    this.isLoading = true
    this.errorMessage = ""
    this.successMessage = ""

    const credentials = {
      email: this.f["email"].value,
      password: this.f["password"].value,
    }

    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Đăng nhập thành công! Đang chuyển hướng...';

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 800); // delay nhẹ để hiển thị thông báo
      },
      error: (error) => {
        this.isLoading = false;

        if (error.status === 500) {
          this.errorMessage = 'Kiểm tra lại email/mật khẩu hoặc trạng thái kích hoạt tài khoản của bạn (kiểm tra email/spam).';
        } else {
          this.errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
        }
      },
    })
  }

  onGoogleLogin(): void {
    // Implement Google login
    this.successMessage = "Tính năng đăng nhập bằng Google sẽ được triển khai sớm!"
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key)
      control?.markAsTouched()
    })
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName)
    if (field?.errors && field.touched) {
      if (field.errors["required"]) {
        return `${this.getFieldLabel(fieldName)} không được để trống`
      }
      if (field.errors["email"]) {
        return "Email không hợp lệ"
      }
      if (field.errors["minlength"]) {
        return `${this.getFieldLabel(fieldName)} phải có ít nhất ${field.errors["minlength"].requiredLength} ký tự`
      }
    }
    return ""
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      email: "Email",
      password: "Mật khẩu",
    }
    return labels[fieldName] || fieldName
  }
}
