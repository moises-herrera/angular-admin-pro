import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Collection } from '../interfaces/types/collection.type';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private _displayModal: boolean = false;
  public type!: Collection;
  public id!: string;
  public img!: string;

  public imageUploaded: EventEmitter<string> = new EventEmitter<string>();

  get displayModal(): boolean {
    return this._displayModal;
  }

  constructor() {}

  openModal(type: Collection, id: string, img: string = 'no-img'): void {
    this._displayModal = true;
    this.type = type;
    this.id = id;

    if (this.img?.includes('https')) {
      this.img = img;
    } else {
      this.img = `${base_url}/upload/${type}/${img}`;
    }
  }

  closeModal(): void {
    this._displayModal = false;
  }
}
