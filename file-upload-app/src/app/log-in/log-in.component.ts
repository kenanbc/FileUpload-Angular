import { Component, EventEmitter, Output } from '@angular/core';
import { SharedDataService } from '../shared/shared-data.service';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { UserModel } from '../shared/user-model';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
})
export class LogInComponent {
  @Output() verifyEmitter = new EventEmitter<boolean>();

  constructor(
    private sharedDataService: SharedDataService,
    private router: Router,
    private authService: AuthService
  ) {}

  userEmail: string = '';
  userPassword: string = '';
  token: string | null = null;
  //receivedBoolean: boolean = false;
  errorMessage: string | null = null;

  ngOnInit() {
    // this.sharedDataService.booleanValue$.subscribe((value) => {
    //   this.receivedBoolean = value;
    // });
    this.token = this.authService.getToken();
  }

  onClicked() {
    this.authService.login(this.userEmail, this.userPassword).subscribe(
      (data: UserModel) => {
        this.token = data.token;
        this.authService.saveToken(this.token);
        //this.sharedDataService.updateBooleanValue(true);
        //this.sharedDataService.updateUserId(odgovor.result_id);
        this.sharedDataService.saveUserID(data.result_id);
        //console.log(this.token);
        this.router.navigate(['/upload']);
      },
      (error) => {
        this.errorMessage = error;
        //console.log('Greska prilikom prijave:', error);
      }
    );
  }
}
