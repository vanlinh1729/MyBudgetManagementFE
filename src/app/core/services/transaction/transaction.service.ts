import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Transaction, CreateTransactionCommand, UpdateTransactionCommand, FilterParams } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) { }

  getTransactions(params?: FilterParams): Observable<Transaction[]> {
    let httpParams = new HttpParams();
    
    if (params?.year) {
      httpParams = httpParams.set('year', params.year.toString());
    }
    if (params?.month) {
      httpParams = httpParams.set('month', params.month.toString());
    }

    return this.http.get<Transaction[]>(this.baseUrl, { params: httpParams });
  }

  getTransactionById(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.baseUrl}/${id}`);
  }

  createTransaction(command: CreateTransactionCommand): Observable<any> {
    return this.http.post(this.baseUrl, command, { responseType: 'text' });
  }

  updateTransaction(id: string, command: UpdateTransactionCommand): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, command, { responseType: 'text' });
  }

  deleteTransaction(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }
} 