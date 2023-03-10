import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import Swal from 'sweetalert2';
import { LoginForm } from 'src/app/models';
import { UserService } from 'src/app/services/user.service';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('googleBtn') googleBtn!: ElementRef<HTMLDivElement>;

  public formSubmitted = false;

  public loginForm = this.fb.group({
    email: [
      localStorage.getItem('email') || '',
      [Validators.required, Validators.email],
    ],
    password: ['', Validators.required],
    remember: [false],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngAfterViewInit(): void {
    google.accounts.id.renderButton(
      this.googleBtn.nativeElement,
      { theme: 'outline', size: 'large' } // customization attributes
    );
  }

  login(): void {
    this.userService
      .login(this.loginForm.value as LoginForm)
      .pipe(first())
      .subscribe({
        next: () => {
          if (this.loginForm.get('remember')?.value) {
            localStorage.setItem(
              'email',
              this.loginForm.get('email')?.value || ''
            );
          } else {
            localStorage.removeItem('email');
          }

          this.router.navigate(['/']);
        },
        error: (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        },
      });
  }
}
