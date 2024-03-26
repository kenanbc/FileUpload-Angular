import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  constructor(private http: HttpClient) { }

  saveUserID(userID: number): number | null {
    localStorage.setItem('userID', userID.toString());
    return userID;
  }

  getUserID(): string | null {
    return localStorage.getItem('userID');
  }

  logout(): void {
    localStorage.removeItem('userID');
  }
  
}
