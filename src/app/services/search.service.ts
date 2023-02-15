import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Collection,
  CollectionSearchResponse,
  Doctor,
  GlobalSearchResponse,
  Hospital,
  User,
} from 'src/app/models';

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

  searchGlobal(term: string): Observable<GlobalSearchResponse> {
    const url = `${base_url}/all/${term}`;
    return this.http.get<GlobalSearchResponse>(url, { headers: this.headers });
  }

  search(
    type: Collection,
    term: string
  ): Observable<User[] | Hospital[] | Doctor[]> {
    const url = `${base_url}/all/collection/${type}/${term}`;
    return this.http
      .get<CollectionSearchResponse>(url, { headers: this.headers })
      .pipe(
        map(({ results }) => {
          switch (type) {
            case 'users':
              return results as User[];

            case 'hospitals':
              return results as Hospital[];

            case 'doctors':
              return results as Doctor[];
          }
        })
      );
  }
}
