import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';

declare const google: any;

const base_url = environment.base_url;
const googleApiKey = environment.googleApiKey;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private googleUser: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.googleInit();
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
    const headers = new HttpHeaders().set(
      'x-token',
      localStorage.getItem('token') || ''
    );

    return this.http.get(`${base_url}/login/renew`, { headers }).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
      }),
      map(() => true),
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

  login(formData: LoginForm): Observable<Object> {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
      })
    );
  }

  loginGoogle(token: string): Observable<Object> {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap(({ token, email }: any) => {
        localStorage.setItem('token', token);
        this.googleUser = email;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');

    if (this.googleUser) {
      this.logoutGoogle();
    }
  }

  logoutGoogle(): void {
    google.accounts.id.revoke(this.googleUser, () => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }
}
