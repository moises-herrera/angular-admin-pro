import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Hospital,
  LoadHospitalsResponse,
  StandardResponse,
  HospitalResponse
} from 'src/app/models';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers(): HttpHeaders {
    return new HttpHeaders().set('x-token', this.token);
  }

  loadHospitals(): Observable<Hospital[]> {
    const url = `${base_url}/hospitals`;
    return this.http
      .get<LoadHospitalsResponse>(url, { headers: this.headers })
      .pipe(map(({ hospitals }) => hospitals));
  }

  createHospital(name: string): Observable<HospitalResponse> {
    const url = `${base_url}/hospitals`;
    return this.http.post<HospitalResponse>(
      url,
      { name },
      { headers: this.headers }
    );
  }

  updateHospital(_id: string, name: string): Observable<HospitalResponse> {
    const url = `${base_url}/hospitals/${_id}`;
    return this.http.put<HospitalResponse>(
      url,
      { name },
      { headers: this.headers }
    );
  }

  deleteHospital(_id: string): Observable<StandardResponse> {
    const url = `${base_url}/hospitals/${_id}`;
    return this.http.delete<StandardResponse>(url, { headers: this.headers });
  }
}
