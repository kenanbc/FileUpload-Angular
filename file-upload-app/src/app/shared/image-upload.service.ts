import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private uploadUrl = 'http://localhost:3000/uploadImage';

  constructor(private http: HttpClient) { }

  uploadImage(user_id: number, image: File) {
    const formData = new FormData();
    formData.append('user_id', user_id.toString());
    formData.append('image', image);

    return this.http.post(this.uploadUrl, formData);
  }
}
