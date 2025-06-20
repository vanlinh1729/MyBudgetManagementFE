import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TokenService } from './token.service';

export interface LoginDto {
  email: string;
  password: string;
}
export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
}
export interface ActivateAccountDto {
  email: string;
  code: string;
}
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  login(data: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, data).pipe(
      tap((res) => {
        this.tokenService.setTokens(res.accessToken, res.refreshToken);
        localStorage.setItem('roles', JSON.stringify(res.roles));
      })
    );
  }

  register(data: RegisterDto): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, data);
  }

  activateAccount(data: ActivateAccountDto): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/activate-account`, data);
  }

  resendActivation(email: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/resend-activation`, { email });
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.tokenService.refreshToken;
    return this.http.post<AuthResponse>(`${this.baseUrl}/refresh-token`, { refreshToken }).pipe(
      tap((res) => {
        this.tokenService.setTokens(res.accessToken, res.refreshToken);
      })
    );
  }

  logout() {
    this.tokenService.clear();
    localStorage.removeItem('roles');
  }

  getRoles(): string[] {
    const raw = localStorage.getItem('roles');
    return raw ? JSON.parse(raw) : [];
  }

  getToken(): string | null {
    return this.tokenService.accessToken;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
