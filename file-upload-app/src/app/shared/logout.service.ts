import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { SharedDataService } from './shared-data.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(private authService: AuthService,
    private sharedData: SharedDataService) { }

    onLogOut(){
      this.authService.logout();
      this.sharedData.logout();
    }
  
}
