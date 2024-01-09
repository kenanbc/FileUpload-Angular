import { Component } from '@angular/core';
import { SharedDataService } from '../shared/shared-data.service';
import { ImageUploadService } from '../shared/image-upload.service';
import { AuthService } from '../shared/auth.service';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  imagePreview: string = '';
  //receivedBoolean: boolean = false;
  selectedImage: File | null = null;
  userId: number = 0;
  token: string | null = null;
  uploaded: number | null = null;
  error: number | null = null;
  btnText: string = "Choose photo";

  constructor(
    private sharedDataService: SharedDataService,
    private imageUploadService: ImageUploadService,
    private authService: AuthService
  ) { }

  ngOnInit() {

    this.userId = Number(this.sharedDataService.getUserID());
    this.token = this.authService.getToken();
    console.log(this.token);
    // this.sharedDataService.userID$.subscribe(value => {
    //   this.userId = value;
    // });

    // this.sharedDataService.booleanValue$.subscribe(value => {
    //   this.receivedBoolean = value;
    // });
  }

  onImagePicked(event: Event) {
    this.uploaded = null;
    this.error = null;
    this.btnText = "Choose photo";
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedImage = inputElement.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  onUpload() {
    if (this.authService.isLoggedIn()) {
      if (this.selectedImage) {
        this.btnText = "Choose new photo";
        this.imageUploadService.uploadImage(this.userId, this.selectedImage)
          .subscribe(
            (data) => {
              if (data) {
                this.uploaded = 1;
              }
            },
            (error) => {
              //console.log("Error je: " + JSON.stringify(error));
              this.error = error;
            }
          );

      }
    }
  }
}
