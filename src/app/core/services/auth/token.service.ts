import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class TokenService {
  get accessToken(): string | null {
    return localStorage.getItem('token');
  }

  get refreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  setTokens(token: string, refresh: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refresh);
  }

  clear() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
}
