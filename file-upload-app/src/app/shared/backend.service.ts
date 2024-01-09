import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {

  }

  postPodatak(userEmail: string, userPassword: string) {
    const data = {
      email: userEmail,
      password: userPassword
    };
    return this.http.post(`${this.apiUrl}/loggedin`, data);
  }

  registerUser(userName: string, userEmail: string, userPassword: string) {
    const data = {
      name: userName,
      email: userEmail,
      password: userPassword
    };
    return this.http.put(`${this.apiUrl}/newsignup`, data);
  }


}
