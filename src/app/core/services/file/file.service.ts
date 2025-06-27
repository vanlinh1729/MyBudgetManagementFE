import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface FileUploadDto {
  url: string;
  fileName: string;
  size: number;
  contentType: string;
  uploadedAt: string;
}

export interface ApiResponse<T> {
  succeeded: boolean;
  message?: string;
  errors?: string[];
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private readonly API_BASE = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Upload avatar
  uploadAvatar(file: File): Observable<FileUploadDto> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ApiResponse<FileUploadDto>>(`${this.API_BASE}/File/upload-avatar`, formData).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // Upload general file
  uploadFile(file: File, folder: string = 'uploads', width?: number, height?: number): Observable<FileUploadDto> {
    const formData = new FormData();
    formData.append('file', file);

    let url = `${this.API_BASE}/File/upload?folder=${folder}`;
    if (width) url += `&width=${width}`;
    if (height) url += `&height=${height}`;

    return this.http.post<ApiResponse<FileUploadDto>>(url, formData).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // Delete file
  deleteFile(fileUrl: string): Observable<string> {
    return this.http.delete<ApiResponse<string>>(`${this.API_BASE}/File/delete?fileUrl=${encodeURIComponent(fileUrl)}`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: any): Observable<never> {
    console.error('File service error:', error);
    
    let errorMessage = 'Có lỗi xảy ra khi xử lý file';
    
    if (error.error) {
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error.message) {
        errorMessage = error.error.message;
      } else if (error.error.errors && error.error.errors.length > 0) {
        errorMessage = error.error.errors[0];
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
} 