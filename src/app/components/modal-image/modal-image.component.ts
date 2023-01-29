import { Component } from '@angular/core';
import { first } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalService } from 'src/app/services/modal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styles: [],
})
export class ModalImageComponent {
  public fileImage!: File;
  public imagePreview!: string | ArrayBuffer | null;

  get displayModal(): boolean {
    return this.modalService.displayModal;
  }

  get imageUrl(): string {
    return this.modalService.img;
  }

  constructor(
    private modalService: ModalService,
    private fileUploadService: FileUploadService
  ) {}

  closeModal(): void {
    this.imagePreview = null;
    this.modalService.closeModal();
  }

  changeImage(eventTarget: EventTarget | null): void {
    const { files } = eventTarget as HTMLInputElement;
    if (!files || files?.length === 0) {
      this.imagePreview = null;
      return;
    }
    this.fileImage = files[0];

    const reader = new FileReader();
    reader.readAsDataURL(this.fileImage);

    reader.onloadend = () => {
      this.imagePreview = reader.result;
    };
  }

  uploadImage(): void {
    const id = this.modalService.id;
    const type = this.modalService.type;

    this.fileUploadService
      .updatePhoto(this.fileImage, type, id)
      .pipe(first())
      .subscribe({
        next: (image) => {
          Swal.fire('Saved', 'Image has been updated', 'success');
          this.modalService.imageUploaded.emit(image);
        },
        error: (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        },
        complete: () => this.closeModal(),
      });
  }
}
