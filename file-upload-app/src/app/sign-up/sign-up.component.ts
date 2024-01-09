import { Component } from '@angular/core';
import { BackendService } from '../shared/backend.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { UserModel } from '../shared/user-model';
import { SharedDataService } from '../shared/shared-data.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  userName: string = '';
  userEmail: string = '';
  userPassword: string = '';
  token: string | null = null;
  errMessage: string | null = null;

  constructor(private backend: BackendService,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private sharedData: SharedDataService) {

  }

  ngOnInit() {
    this.token = this.authService.getToken();
  }

  onRegister() {
    this.backend.registerUser(this.userName, this.userEmail, this.userPassword)
      .subscribe((data) => {
        console.log("Odgovor je " + data);
        this.authService.login(this.userEmail, this.userPassword).subscribe((result: UserModel) => {
          this.token = result.token;
          this.authService.saveToken(this.token);
          this.sharedData.saveUserID(result.result_id);
          this.router.navigate(["/upload"]);
        });
      }, (error) => {
        if (error.status === 401) this.errMessage = "User is not registered!";
        else if (error.status === 406) this.errMessage = "Email is already in use!";
      });
  }
}
