import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Collection } from '../interfaces/types/collection.type';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private http: HttpClient) {}

  updatePhoto(file: File, type: Collection, id: string): Observable<string> {
    const url = `${base_url}/upload/${type}/${id}`;
    const headers = new HttpHeaders().set(
      'x-token',
      localStorage.getItem('token') || ''
    );
    const formData = new FormData();
    formData.append('image', file);

    return this.http
      .put(url, formData, { headers })
      .pipe(map(({ fileName }: any) => fileName));
  }
}
