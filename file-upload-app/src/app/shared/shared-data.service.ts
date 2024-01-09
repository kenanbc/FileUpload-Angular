import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  constructor(private http: HttpClient) { }

  // private booleanValueSource = new BehaviorSubject<boolean>(false);
  // booleanValue$ = this.booleanValueSource.asObservable();

  // private userIdSource = new BehaviorSubject<number>(0);
  // userID$ = this.userIdSource.asObservable();

  // updateBooleanValue(value: boolean) {
  //   this.booleanValueSource.next(value);
  // }

  // updateUserId(value: number) {
  //   this.userIdSource.next(value);
  // }

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
