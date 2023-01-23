import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { ProfileData } from '../interfaces/profile-data.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
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
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.user.uid || '';
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
    const headers = new HttpHeaders().set('x-token', this.token);

    return this.http.get(`${base_url}/login/renew`, { headers }).pipe(
      map((res: any) => {
        const { name, email, role, google, img, uid } = res.user;
        this.user = new User(name, email, google, img, role, uid);
        localStorage.setItem('token', res.token);
        return true;
      }),
      catchError(() => of(false))
    );
  }

  createUser(formData: RegisterForm): Observable<Object> {
    return this.http.post(`${base_url}/users`, formData).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
      })
    );
  }

  updateProfile(data: ProfileData) {
    const headers = new HttpHeaders().set('x-token', this.token);
    return this.http.put(`${base_url}/users/${this.uid}`, data, {
      headers,
    });
  }

  login(formData: LoginForm): Observable<Object> {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
      })
    );
  }

  loginGoogle(token: string): Observable<Object> {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap(({ token }: any) => {
        localStorage.setItem('token', token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');

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
}
