import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Collection } from '../interfaces/types/collection.type';
import { Doctor } from '../models/doctor.model';
import { Hospital } from '../models/hospital.model';
import { User } from '../models/user.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers(): HttpHeaders {
    return new HttpHeaders().set('x-token', this.token);
  }

  private parseUsers(results: any[]): User[] {
    return results.map(
      ({ name, email, google, img, role, uid }) =>
        new User(name, email, google, img, role, uid)
    );
  }

  searchGlobal(term: string) {
    const url = `${base_url}/all/${term}`;
    return this.http.get(url, { headers: this.headers });
  }

  search(type: Collection, term: string): Observable<User[] | Hospital[]> {
    const url = `${base_url}/all/collection/${type}/${term}`;
    return this.http
      .get<User[] | Hospital[]>(url, { headers: this.headers })
      .pipe(
        map(({ results }: any) => {
          switch (type) {
            case 'users':
              return this.parseUsers(results);

            case 'hospitals':
              return results as Hospital[];

            case 'doctors':
              return results as Doctor[];
          }
        })
      );
  }
}
