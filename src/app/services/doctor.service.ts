import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadDoctors } from '../interfaces/load-doctors.interface';
import { Doctor } from '../models/doctor.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers(): HttpHeaders {
    return new HttpHeaders().set('x-token', this.token);
  }

  loadDoctors(): Observable<Doctor[]> {
    const url = `${base_url}/doctors`;
    return this.http
      .get<LoadDoctors>(url, { headers: this.headers })
      .pipe(map(({ doctors }) => doctors));
  }

  getDoctorById(id: string) {
    const url = `${base_url}/doctors/${id}`;
    return this.http
      .get(url, { headers: this.headers })
      .pipe(map(({ doctor }: any) => doctor));
  }

  createDoctor(doctor: Doctor) {
    const url = `${base_url}/doctors`;
    return this.http.post(url, doctor, { headers: this.headers });
  }

  updateDoctor(doctor: Doctor) {
    const url = `${base_url}/doctors/${doctor._id}`;
    return this.http.put(url, doctor, { headers: this.headers });
  }

  deleteDoctor(_id: string) {
    const url = `${base_url}/doctors/${_id}`;
    return this.http.delete(url, { headers: this.headers });
  }
}
