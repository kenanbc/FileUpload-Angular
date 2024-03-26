import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedDataService } from '../shared/shared-data.service';
import { AuthService } from '../shared/auth.service';
import { LogoutService } from '../shared/logout.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  
  token: string | null = null;

  constructor(private router: Router,
              private authService: AuthService,
              private logout: LogoutService){

  }

  ngDoCheck(){
    this.token = this.authService.getToken();
  }

  onLoginClicked(){
    this.router.navigate(['/login']);
  }

  onSignupClicked(){
    this.router.navigate(['/signup']);
  }

  onLogOffClicked(){
    this.logout.onLogOut();
    this.router.navigate(['/login']);
  }


}
