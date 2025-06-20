import { Component, OnInit, ViewEncapsulation } from "@angular/core"
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms"
import { ReactiveFormsModule } from '@angular/forms'; // ✅ Import this
import { CommonModule } from '@angular/common'; // optional but useful

import { Router, RouterModule } from "@angular/router"
import { AuthService } from "../../../core/services/auth/auth.service"
import { LucideAngularModule } from 'lucide-angular';

@Component({
  encapsulation: ViewEncapsulation.None,

  selector: "app-register",
  templateUrl: "./register.component.html",
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule], // ✅ Add ReactiveFormsModule here
  styleUrls: ["../login/login.component.css"],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup
  isLoading = false
  showPassword = false
  showConfirmPassword = false
  errorMessage = ""
  successMessage = ""
  passwordStrength = {
    score: 0,
    label: "Độ mạnh mật khẩu",
    class: "",
  }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initializeForm()
  }

  private initializeForm(): void {
    this.registerForm = this.formBuilder.group(
      {
        fullName: ["", [Validators.required, Validators.minLength(2)]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(8)]],
        confirmPassword: ["", [Validators.required]],
        terms: [false, [Validators.requiredTrue]],
      },
      {
        validators: this.passwordMatchValidator,
      },
    )

    // Watch password changes for strength indicator
    this.registerForm.get("password")?.valueChanges.subscribe((password) => {
      this.updatePasswordStrength(password)
    })
  }

  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get("password")
    const confirmPassword = control.get("confirmPassword")

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true }
    }
    return null
  }

  get f() {
    return this.registerForm.controls
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword
  }

  updatePasswordStrength(password: string): void {
    let score = 0
    let label = ""
    let className = ""

    if (!password) {
      this.passwordStrength = { score: 0, label: "Độ mạnh mật khẩu", class: "" }
      return
    }

    // Length check
    if (password.length >= 8) score += 1

    // Lowercase check
    if (/[a-z]/.test(password)) score += 1

    // Uppercase check
    if (/[A-Z]/.test(password)) score += 1

    // Number check
    if (/\d/.test(password)) score += 1

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1

    switch (score) {
      case 0:
      case 1:
        label = "Mật khẩu yếu"
        className = "weak"
        break
      case 2:
      case 3:
        label = "Mật khẩu trung bình"
        className = "fair"
        break
      case 4:
        label = "Mật khẩu tốt"
        className = "good"
        break
      case 5:
        label = "Mật khẩu mạnh"
        className = "strong"
        break
    }

    this.passwordStrength = { score, label, class: className }
  }
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = "";
    this.successMessage = "";

    const userData = {
      fullName: this.f["fullName"].value,
      email: this.f["email"].value,
      password: this.f["password"].value,
    };

    this.authService.register(userData).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = "Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.";

        setTimeout(() => {
          this.router.navigate(["/auth/login"]);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;

        // Nếu backend trả lỗi 409 (email đã tồn tại) hoặc 400 (form sai)
        if (error.status === 409) {
          this.errorMessage = "Email đã được sử dụng.";
        } else if (error.status === 400) {
          this.errorMessage = "Thông tin đăng ký không hợp lệ.";
        } else {
          this.errorMessage = "Có lỗi xảy ra. Vui lòng thử lại.";
        }
      },
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach((key) => {
      const control = this.registerForm.get(key)
      control?.markAsTouched()
    })
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName)
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
      if (field.errors["requiredTrue"]) {
        return "Bạn phải đồng ý với điều khoản dịch vụ"
      }
    }

    // Check for password mismatch
    if (fieldName === "confirmPassword" && this.registerForm.errors?.["passwordMismatch"] && field?.touched) {
      return "Mật khẩu xác nhận không khớp"
    }

    return ""
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      fullName: "Họ và tên",
      email: "Email",
      password: "Mật khẩu",
      confirmPassword: "Xác nhận mật khẩu",
      terms: "Điều khoản",
    }
    return labels[fieldName] || fieldName
  }
}
