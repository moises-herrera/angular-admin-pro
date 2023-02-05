import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadUsers } from '../interfaces/load-users.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { MenuItem } from '../interfaces/menu-item.interface';
import { ProfileData } from '../interfaces/profile-data.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { Role } from '../interfaces/types/role.type';
import { User } from '../models/user.model';

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
      .get(`${base_url}/login/renew`, { headers: this.headers })
      .pipe(
        map(
          ({
            token,
            menu,
            user: { name, email, role, google, img, uid },
          }: any) => {
            this.user = new User(name, email, google, img, role, uid);
            this.setLocalStorageInfo(token, menu);
            return true;
          }
        ),
        catchError(() => of(false))
      );
  }

  createUser(formData: RegisterForm): Observable<Object> {
    return this.http.post(`${base_url}/users`, formData).pipe(
      tap(({ token, menu }: any) => {
        this.setLocalStorageInfo(token, menu);
      })
    );
  }

  updateProfile(data: ProfileData): Observable<Object> {
    return this.http.put(`${base_url}/users/${this.uid}`, data, {
      headers: this.headers,
    });
  }

  login(formData: LoginForm): Observable<Object> {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap(({ token, menu }: any) => {
        this.setLocalStorageInfo(token, menu);
      })
    );
  }

  loginGoogle(token: string): Observable<Object> {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap(({ token, menu }: any) => {
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

  loadUsers(from: number = 0): Observable<LoadUsers> {
    const url = `${base_url}/users`;
    const params = new HttpParams().set('from', from);
    return this.http
      .get<LoadUsers>(url, { headers: this.headers, params })
      .pipe(
        map(({ total, users }) => {
          const mappedUsers = users.map(
            ({ name, email, google, img, role, uid }) =>
              new User(name, email, google, img, role, uid)
          );

          return {
            total,
            users: mappedUsers,
          };
        })
      );
  }

  updateUser(user: User): Observable<Object> {
    return this.http.put(`${base_url}/users/${user.uid}`, user, {
      headers: this.headers,
    });
  }

  deleteUser(userId: string): Observable<Object> {
    const url = `${base_url}/users/${userId}`;
    return this.http.delete(url, { headers: this.headers });
  }
}
