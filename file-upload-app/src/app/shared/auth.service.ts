
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedDataService } from './shared-data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient,
    private sharedData: SharedDataService) {}

  login(email: string, password: string): Observable<any> {
    const userData = { email: email, password: password };
    return this.http.post(`${this.apiUrl}/loggedin`, userData);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null && token !== undefined;
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
