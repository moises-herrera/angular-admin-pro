import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  User,
  MenuItem,
  LoginRenewResponse,
  RegisterForm,
  ProfileData,
  LoginForm,
  LoginResponse,
  LoadUsersResponse,
  StandardResponse,
  Role,
} from 'src/app/models';

declare const google: any;

const base_url = environment.base_url;
const googleApiKey = environment.googleApiKey;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user!: User;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {
    if (this.user?.google) {
      this.googleInit();
    }
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role(): Role {
    return this.user.role;
  }

  get uid(): string {
    return this.user.uid || '';
  }

  get headers(): HttpHeaders {
    return new HttpHeaders().set('x-token', this.token);
  }

  setLocalStorageInfo(token: string, menu: MenuItem[]): void {
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  removeLocalStorageInfo(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
  }

  googleInit(): void {
    google.accounts.id.initialize({
      client_id: googleApiKey,
      callback: (response: any) => this.handleCredentialResponse(response),
    });
  }

  handleCredentialResponse(response: any): void {
    this.loginGoogle(response.credential).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.router.navigate(['/']);
        });
      },
    });
  }

  validateToken(): Observable<boolean> {
    return this.http
      .get<LoginRenewResponse>(`${base_url}/login/renew`, {
        headers: this.headers,
      })
      .pipe(
        map(({ token, menu, user }) => {
          this.user = user;
          this.setLocalStorageInfo(token, menu);
          return true;
        }),
        catchError(() => of(false))
      );
  }

  createUser(formData: RegisterForm): Observable<LoginRenewResponse> {
    return this.http
      .post<LoginRenewResponse>(`${base_url}/users`, formData)
      .pipe(
        tap(({ token, menu }) => {
          this.setLocalStorageInfo(token, menu);
        })
      );
  }

  updateProfile(data: ProfileData): Observable<User> {
    return this.http.put<User>(`${base_url}/users/${this.uid}`, data, {
      headers: this.headers,
    });
  }

  login(formData: LoginForm): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${base_url}/login`, formData).pipe(
      tap(({ token, menu }) => {
        this.setLocalStorageInfo(token, menu);
      })
    );
  }

  loginGoogle(token: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${base_url}/login/google`, { token })
      .pipe(
        tap(({ token, menu }) => {
          this.setLocalStorageInfo(token, menu);
        })
      );
  }

  logout(): void {
    this.removeLocalStorageInfo();

    if (this.user.google) {
      this.logoutGoogle();
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  logoutGoogle(): void {
    google.accounts.id.revoke(this.user.email, () => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  loadUsers(from: number = 0): Observable<LoadUsersResponse> {
    const url = `${base_url}/users`;
    const params = new HttpParams().set('from', from);
    return this.http.get<LoadUsersResponse>(url, {
      headers: this.headers,
      params,
    });
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${base_url}/users/${user.uid}`, user, {
      headers: this.headers,
    });
  }

  deleteUser(userId: string): Observable<StandardResponse> {
    const url = `${base_url}/users/${userId}`;
    return this.http.delete<StandardResponse>(url, { headers: this.headers });
  }
}
