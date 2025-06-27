import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Category, CreateCategoryCommand, UpdateCategoryCommand } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`);
  }

  createCategory(command: CreateCategoryCommand): Observable<any> {
    return this.http.post(this.baseUrl, command, { responseType: 'text' });
  }

  updateCategory(id: string, command: UpdateCategoryCommand): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, command, { responseType: 'text' });
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }
} 