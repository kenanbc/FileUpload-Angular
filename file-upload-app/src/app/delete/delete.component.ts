import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ImageModel } from '../shared/image-model';
import { SharedDataService } from '../shared/shared-data.service';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent {

  images: ImageModel[] = [];
  userId: number = 0;
  token: string | null = null;
  selectedImagePaths: string[] = [];
  backendUrl: string = "http://localhost:3000/";

  constructor(private http: HttpClient,
    private sharedData: SharedDataService,
    private authService: AuthService,
    private route: Router) { }


  ngOnInit() {

    this.token = this.authService.getToken();
    this.userId = Number(this.sharedData.getUserID());
    this.http.get<any>(`${this.backendUrl}images/${this.userId}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }).subscribe((data) => {
      // console.log(data);
      this.images = data.result;
      // console.log(data.result);
    });

  }

  toggleSelect(image: any): void {
    image.selected = !image.selected;
    if (image.selected) {
      this.selectedImagePaths.push(image.image_path);
    }
    else {
      const index = this.selectedImagePaths.indexOf(image.image_path);
      if (index !== -1) {
        this.selectedImagePaths.splice(index, 1);
      }
    }
  }

  deleteSelected() {
    const paths = { imagePaths: this.selectedImagePaths };
    this.http.delete<any>(`${this.backendUrl}delete/${this.userId}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      body: { paths }
    }).subscribe((data) => {
      this.images = this.images.filter(image => !this.selectedImagePaths. includes(image.image_path));
      this.selectedImagePaths = [];
      // console.log("Data je ovdje : " + JSON.stringify(data));
    });
  }
}
