import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  DebtAndLoan, 
  CreateDebtAndLoanCommand, 
  UpdateDebtAndLoanCommand, 
  PayDebtAndLoanCommand,
  Payment,
  DebtLoanOverview
} from '../../models';

@Injectable({
  providedIn: 'root'
})
export class DebtLoanService {
  private baseUrl = `${environment.apiUrl}/debt-and-loans`;

  constructor(private http: HttpClient) { }

  getDebtAndLoans(): Observable<DebtAndLoan[]> {
    return this.http.get<DebtAndLoan[]>(this.baseUrl);
  }

  getDebtAndLoanById(id: string): Observable<DebtAndLoan> {
    return this.http.get<DebtAndLoan>(`${this.baseUrl}/${id}`);
  }

  createDebtAndLoan(command: CreateDebtAndLoanCommand): Observable<any> {
    return this.http.post(this.baseUrl, command, { responseType: 'text' });
  }

  updateDebtAndLoan(id: string, command: UpdateDebtAndLoanCommand): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, command, { responseType: 'text' });
  }

  deleteDebtAndLoan(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  payDebtAndLoan(id: string, command: PayDebtAndLoanCommand): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/pay`, command, { responseType: 'text' });
  }

  getPayments(id: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/${id}/payments`);
  }

  getSummary(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}/summary`);
  }

  getOverview(): Observable<DebtLoanOverview> {
    return this.http.get<DebtLoanOverview>(`${this.baseUrl}/overview`);
  }
} 