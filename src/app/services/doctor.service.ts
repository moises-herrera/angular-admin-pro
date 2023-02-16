import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Doctor,
  DoctorResponse,
  LoadDoctorsResponse,
  StandardResponse,
} from 'src/app/models';

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
      .get<LoadDoctorsResponse>(url, { headers: this.headers })
      .pipe(map(({ doctors }) => doctors));
  }

  getDoctorById(id: string): Observable<Doctor> {
    const url = `${base_url}/doctors/${id}`;
    return this.http
      .get<DoctorResponse>(url, { headers: this.headers })
      .pipe(map(({ doctor }) => doctor));
  }

  createDoctor(doctor: Doctor): Observable<Doctor> {
    const url = `${base_url}/doctors`;
    return this.http
      .post<DoctorResponse>(url, doctor, {
        headers: this.headers,
      })
      .pipe(map(({ doctor }) => doctor));
  }

  updateDoctor(doctor: Doctor): Observable<DoctorResponse> {
    const url = `${base_url}/doctors/${doctor._id}`;
    return this.http.put<DoctorResponse>(url, doctor, {
      headers: this.headers,
    });
  }

  deleteDoctor(_id: string): Observable<StandardResponse> {
    const url = `${base_url}/doctors/${_id}`;
    return this.http.delete<StandardResponse>(url, { headers: this.headers });
  }
}
