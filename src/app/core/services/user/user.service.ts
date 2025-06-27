import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { UserProfile, Gender, Currencies, SearchResult } from '../../models';
import { FileService, FileUploadDto } from '../file/file.service';

export interface UpdateUserProfileDto {
  fullName?: string;
  gender?: Gender;
  dateOfBirth?: string;
  phoneNumber?: string;
  currency?: Currencies;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  public userProfile$ = this.userProfileSubject.asObservable();
  
  private readonly API_BASE = environment.apiUrl;
  private userProfileCache: UserProfile | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(private http: HttpClient, private fileService: FileService) {}

  // Get current user profile with caching
  getUserProfile(): Observable<UserProfile> {
    // Check cache first
    if (this.userProfileCache && this.isCacheValid()) {
      return of(this.userProfileCache);
    }

    return this.http.get<UserProfile>(`${this.API_BASE}/users/profile`).pipe(
      tap(profile => {
        this.updateCache(profile);
        this.userProfileSubject.next(profile);
      }),
      catchError(this.handleError)
    );
  }

  // Update user profile
  updateUserProfile(profile: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.API_BASE}/users/profile`, profile).pipe(
      tap(updatedProfile => {
        this.updateCache(updatedProfile);
        this.userProfileSubject.next(updatedProfile);
      }),
      catchError(this.handleError)
    );
  }

  // Change user password
  changePassword(passwords: { currentPassword: string; newPassword: string; confirmPassword: string }): Observable<any> {
    return this.http.post(`${this.API_BASE}/users/change-password`, passwords, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete user account
  deleteAccount(deleteRequest: { password: string; confirmationText: string }): Observable<any> {
    return this.http.delete(`${this.API_BASE}/users/account`, { 
      body: deleteRequest,
      responseType: 'text' 
    }).pipe(
      tap(() => {
        // Clear cache and profile on account deletion
        this.clearCache();
        this.userProfileSubject.next(null);
      }),
      catchError(this.handleError)
    );
  }

  // Get user display name
  getUserDisplayName(profile: UserProfile | null): string {
    if (!profile) return 'Người dùng';
    return profile.fullName || profile.email || 'Người dùng';
  }

  // Get user avatar with fallback
  getUserAvatar(profile: UserProfile | null): string {
    if (profile?.avatar) {
      return profile.avatar;
    }
    return this.generateDefaultAvatar(profile);
  }

  // Generate default avatar SVG
  generateDefaultAvatar(profile: UserProfile | null): string {
    const initials = this.getInitials(profile);
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const colorIndex = initials.charCodeAt(0) % colors.length;
    const bgColor = colors[colorIndex];

    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="${bgColor}"/>
        <text x="20" y="26" font-family="Inter, Arial, sans-serif" font-weight="600" 
              font-size="14" fill="white" text-anchor="middle">${initials}</text>
      </svg>
    `)}`;
  }

  // Get user initials
  private getInitials(profile: UserProfile | null): string {
    if (!profile) return 'U';
    
    if (profile.fullName) {
      const names = profile.fullName.trim().split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    
    if (profile.email) {
      return profile.email[0].toUpperCase();
    }
    
    return 'U';
  }

  // Get gender label
  getGenderLabel(gender: Gender): string {
    switch (gender) {
      case Gender.Male: return 'Nam';
      case Gender.Female: return 'Nữ';
      case Gender.Other: return 'Khác';
      default: return 'Không xác định';
    }
  }

  // Get currency label
  getCurrencyLabel(currency: Currencies): string {
    const currencyMap: Record<number, string> = {
      [Currencies.AUD]: 'AUD - Australian Dollar',
      [Currencies.CAD]: 'CAD - Canadian Dollar', 
      [Currencies.CNY]: 'CNY - Chinese Yuan',
      [Currencies.HKD]: 'HKD - Hong Kong Dollar',
      [Currencies.JPY]: 'JPY - Japanese Yen',
      [Currencies.NZD]: 'NZD - New Zealand Dollar',
      [Currencies.VND]: 'VND - Việt Nam Đồng',
      [Currencies.CHF]: 'CHF - Swiss Franc',
      [Currencies.GBP]: 'GBP - British Pound',
      [Currencies.USD]: 'USD - US Dollar',
      [Currencies.EUR]: 'EUR - Euro'
    };
    return currencyMap[currency] || 'Unknown Currency';
  }

  // Format currency amount
  formatCurrency(amount: number, currency: Currencies = Currencies.VND): string {
    const locale = currency === Currencies.VND ? 'vi-VN' : 'en-US';
    const currencyCode = this.getCurrencyCode(currency);
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currency === Currencies.VND ? 0 : 2
    }).format(amount);
  }

  // Get currency code
  private getCurrencyCode(currency: Currencies): string {
    const currencyCodeMap: Record<number, string> = {
      [Currencies.AUD]: 'AUD',
      [Currencies.CAD]: 'CAD',
      [Currencies.CNY]: 'CNY', 
      [Currencies.HKD]: 'HKD',
      [Currencies.JPY]: 'JPY',
      [Currencies.NZD]: 'NZD',
      [Currencies.VND]: 'VND',
      [Currencies.CHF]: 'CHF',
      [Currencies.GBP]: 'GBP',
      [Currencies.USD]: 'USD',
      [Currencies.EUR]: 'EUR'
    };
    return currencyCodeMap[currency] || 'VND';
  }

  // Cache management
  private updateCache(profile: UserProfile): void {
    this.userProfileCache = profile;
    this.cacheTimestamp = Date.now();
  }

  private isCacheValid(): boolean {
    return Date.now() - this.cacheTimestamp < this.CACHE_DURATION;
  }

  private clearCache(): void {
    this.userProfileCache = null;
    this.cacheTimestamp = 0;
  }

  // Error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Đã xảy ra lỗi không xác định';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Lỗi: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Dữ liệu không hợp lệ';
          break;
        case 401:
          errorMessage = 'Không có quyền truy cập';
          break;
        case 403:
          errorMessage = 'Bị cấm truy cập';
          break;
        case 404:
          errorMessage = 'Không tìm thấy dữ liệu';
          break;
        case 500:
          errorMessage = 'Lỗi máy chủ nội bộ';
          break;
        default:
          errorMessage = `Lỗi: ${error.status} - ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }

  // Load user profile on service initialization
  loadUserProfile(): void {
    this.getUserProfile().subscribe({
      next: () => {
        // Profile loaded successfully
      },
      error: (error) => {
        console.error('Failed to load user profile:', error);
        // Set default empty profile to avoid blocking the app
        this.userProfileSubject.next(null);
      }
    });
  }

  // Force refresh user profile (clear cache and reload)
  forceRefreshProfile(): Observable<UserProfile> {
    this.clearCache();
    return this.getUserProfile();
  }

  // Upload avatar
  uploadAvatar(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.API_BASE}/users/upload-avatar`, formData, { responseType: 'text' }).pipe(
      tap(() => {
        // Clear cache and force reload user profile after avatar upload
        this.clearCache();
        this.getUserProfile().subscribe({
          next: (profile) => {
            console.log('Profile reloaded after avatar upload:', profile);
          },
          error: (error) => {
            console.error('Failed to reload profile after avatar upload:', error);
          }
        });
      }),
      catchError(this.handleError)
    );
  }

  // Upload general file
  uploadFile(file: File, folder: string = 'uploads', width?: number, height?: number): Observable<FileUploadDto> {
    return this.fileService.uploadFile(file, folder, width, height);
  }

  // Delete file
  deleteFile(fileUrl: string): Observable<string> {
    return this.fileService.deleteFile(fileUrl);
  }

  // Update user profile with avatar
  updateUserProfileWithAvatar(profile: Partial<UserProfile>, avatarFile?: File): Observable<UserProfile> {
    if (avatarFile) {
      // First upload avatar (this will auto-update profile), then update other fields
      return this.uploadAvatar(avatarFile).pipe(
        switchMap(() => {
          // After avatar upload, update other profile fields and force refresh
          return this.updateUserProfile(profile).pipe(
            switchMap(() => this.forceRefreshProfile())
          );
        }),
        catchError(this.handleError)
      );
    } else {
      return this.updateUserProfile(profile);
    }
  }
} 