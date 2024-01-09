import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

token: string | null = null;
url: string = "/signup";

  constructor(private authService: AuthService){}

  ngOnInit(){
    this.token = this.authService.getToken();
    if(this.token){
      this.url = "/upload";
    }
  }
}
