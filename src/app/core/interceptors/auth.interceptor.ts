import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Routes that don't need authentication
  const isPublicRoute =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/activate') ||
    req.url.includes('/auth/resend-activation-email') ||
    req.url.includes('/auth/refresh-token');

  // Add Authorization header if token exists and route requires auth
  if (!isPublicRoute && token) {
    // Check if this is a file upload request (FormData)
    const isFileUpload = req.body instanceof FormData;
    
    if (isFileUpload) {
      // For file uploads, only add Authorization header, let browser set Content-Type
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      // For regular requests, add both Authorization and Content-Type
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized errors
      if (error.status === 401 && !isPublicRoute) {
        // Try to refresh token
        const refreshToken = authService.getRefreshToken();
        
        if (refreshToken) {
          return authService.refreshToken().pipe(
            switchMap((authResponse) => {
              // Retry the original request with new token
              const isFileUpload = req.body instanceof FormData;
              
              let newReq;
              if (isFileUpload) {
                newReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${authResponse.accessToken}`
                  }
                });
              } else {
                newReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${authResponse.accessToken}`,
                    'Content-Type': 'application/json'
                  }
                });
              }
              
              return next(newReq);
            }),
            catchError((refreshError) => {
              // Refresh failed, logout and redirect to login
              authService.logout();
              router.navigate(['/auth/login']);
              return throwError(() => refreshError);
            })
          );
        } else {
          // No refresh token, logout and redirect
          authService.logout();
          router.navigate(['/auth/login']);
        }
      }

      // Handle other errors
      return throwError(() => error);
    })
  );
};
