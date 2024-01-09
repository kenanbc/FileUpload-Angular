import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedDataService } from './shared-data.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private baseUrl = 'http://localhost:3000/images';

  constructor(private http: HttpClient,
              private sharedData: SharedDataService) {

  }

  //userId: number = 0;

  ngOnInit(){
    // this.sharedData.userID$.subscribe(value => {
    //   this.userId = value;
    // });
  }

  getImagesForUser(userId: string) {
    return this.http.get<any[]>(`${this.baseUrl}/${userId}`);
  }
}
