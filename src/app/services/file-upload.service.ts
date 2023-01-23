import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

type CollectionType = 'users' | 'doctors' | 'hospitals';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private http: HttpClient) {}

  updatePhoto(
    file: File,
    type: CollectionType,
    id: string
  ): Observable<Object> {
    const url = `${base_url}/upload/${type}/${id}`;
    const headers = new HttpHeaders().set(
      'x-token',
      localStorage.getItem('token') || ''
    );
    const formData = new FormData();
    formData.append('image', file);

    return this.http.put(url, formData, { headers });
  }
}
