import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ImageModel } from '../shared/image-model';
import { SharedDataService } from '../shared/shared-data.service';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  images: ImageModel[] = [];
  userId: number = 0;
  token: string | null = null;
  constructor(private http: HttpClient,
    private sharedData: SharedDataService,
    private authService: AuthService) { }


  ngOnInit() {

    this.token = this.authService.getToken();
    this.userId = Number(this.sharedData.getUserID());
    this.http.get<any>(`http://localhost:3000/images/${this.userId}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }).subscribe((data) => {
      this.images = data.result;
    });

  }
}

