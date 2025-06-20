import { Injectable } from "@angular/core"
import type { HttpClient } from "@angular/common/http"
import { BehaviorSubject, type Observable, of } from "rxjs"
import { delay, map, catchError } from "rxjs/operators"

export interface User {
  id: string
  email: string
  fullName: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  terms: boolean
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  token?: string
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  constructor() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser))
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Simulate API call
    return of({
      success: true,
      message: "Đăng nhập thành công!",
      user: {
        id: "1",
        email: credentials.email,
        fullName: "Người dùng",
      },
      token: "fake-jwt-token",
    }).pipe(
      delay(2000), // Simulate network delay
      map((response) => {
        if (response.success && response.user) {
          localStorage.setItem("currentUser", JSON.stringify(response.user))
          localStorage.setItem("token", response.token || "")
          this.currentUserSubject.next(response.user)
        }
        return response
      }),
      catchError((error) => {
        return of({
          success: false,
          message: "Đăng nhập thất bại. Vui lòng thử lại.",
        })
      }),
    )
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    // Simulate API call
    return of({
      success: true,
      message: "Tài khoản đã được tạo thành công! Vui lòng kiểm tra email để xác thực.",
      user: {
        id: "1",
        email: userData.email,
        fullName: userData.fullName,
      },
    }).pipe(
      delay(2000), // Simulate network delay
      catchError((error) => {
        return of({
          success: false,
          message: "Đăng ký thất bại. Vui lòng thử lại.",
        })
      }),
    )
  }

  logout(): void {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("token")
    this.currentUserSubject.next(null)
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value
  }
}
