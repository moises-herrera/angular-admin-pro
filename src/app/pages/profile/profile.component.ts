import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import Swal from 'sweetalert2';

import { User } from 'src/app/models';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [],
})
export class ProfileComponent implements OnInit {
  public profileForm!: FormGroup;
  public user!: User;
  public profileImage!: File;
  public imagePreview!: string | ArrayBuffer | null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private fileUploadService: FileUploadService
  ) {
    this.user = this.userService.user;
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: [this.user.name, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      role: [this.user.role || ''],
    });
  }

  updateProfile(): void {
    this.userService
      .updateProfile(this.profileForm.value)
      .pipe(first())
      .subscribe({
        next: () => {
          const { name, email } = this.profileForm.value;
          this.user.name = name;
          this.user.email = email;

          Swal.fire('Saved', 'Your profile has been updated', 'success');
        },
        error: (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        },
      });
  }

  changeImage(eventTarget: EventTarget | null): void {
    const { files } = eventTarget as HTMLInputElement;
    if (!files || files?.length === 0) {
      this.imagePreview = null;
      return;
    }
    this.profileImage = files[0];

    const reader = new FileReader();
    reader.readAsDataURL(this.profileImage);

    reader.onloadend = () => {
      this.imagePreview = reader.result;
    };
  }

  uploadImage(): void {
    if (!this.user.uid) return;

    this.fileUploadService
      .updatePhoto(this.profileImage, 'users', this.user.uid)
      .pipe(first())
      .subscribe({
        next: () => {
          Swal.fire('Saved', 'Image has been updated', 'success');
        },
        error: (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        },
      });
  }
}
