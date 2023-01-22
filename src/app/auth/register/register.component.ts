import { Component, OnDestroy } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { first } from 'rxjs';
import Swal from 'sweetalert2';

import { RegisterForm } from 'src/app/interfaces/register-form.interface';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
})
export class RegisterComponent {
  public formSubmitted = false;

  public registerForm = this.fb.group(
    {
      name: ['Bob', [Validators.required, Validators.minLength(3)]],
      email: ['test00@gmail.com', [Validators.required, Validators.email]],
      password: ['36327', Validators.required],
      password2: ['36327', Validators.required],
      terms: [false, Validators.requiredTrue],
    },
    {
      validators: this.equalPasswords('password', 'password2'),
    } as AbstractControlOptions
  );

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  createUser(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.userService
      .createUser(this.registerForm.value as RegisterForm)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        },
      });
  }

  isFieldInvalid(field: string): boolean {
    return (
      (this.registerForm.get(field)?.errors &&
        this.registerForm.get(field)?.touched) ??
      false
    );
  }

  invalidMatchPasswords(): boolean {
    const password = this.registerForm.get('password')?.value;
    const password2 = this.registerForm.get('password2')?.value;

    return password !== password2;
  }

  equalPasswords(
    fieldName1: string,
    fieldName2: string
  ): (formGroup: FormGroup) => void {
    return (formGroup: FormGroup) => {
      const passwordControl1 = formGroup.get(fieldName1);
      const passwordControl2 = formGroup.get(fieldName2);

      if (passwordControl1?.value === passwordControl2?.value) {
        passwordControl2?.setErrors(null);
      } else {
        passwordControl2?.setErrors({ areNotEqual: true });
      }
    };
  }
}
