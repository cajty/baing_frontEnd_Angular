import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  // styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  readonly loginForm: FormGroup = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;
  error: string | null = null;

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  get emailErrors(): string {
    if (this.emailControl?.errors && this.emailControl.touched) {
      if (this.emailControl.errors['required']) {
        return 'Email is required';
      }
      if (this.emailControl.errors['email'] || this.emailControl.errors['pattern']) {
        return 'Please enter a valid email address';
      }
    }
    return '';
  }

  get passwordErrors(): string {
    if (this.passwordControl?.errors && this.passwordControl.touched) {
      if (this.passwordControl.errors['required']) {
        return 'Password is required';
      }
      if (this.passwordControl.errors['minlength']) {
        return 'Password must be at least 6 characters';
      }
      if (this.passwordControl.errors['pattern']) {
        return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      }
    }
    return '';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.authService.login(this.loginForm.getRawValue())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.error = null;
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.handleLoginError(error);
        }
      });
  }

  private handleLoginError(error: HttpErrorResponse): void {
    if (error.status === 401) {
      this.error = 'Invalid email or password';
    } else if (error.status === 0) {
      this.error = 'Network error - please check your connection';
    } else {
      this.error = error.error?.message || 'Login failed. Please try again.';
    }

    // Log the error for debugging purposes in development
    if (!environment.production) {
      console.error('Login error:', {
        status: error.status,
        message: error.message,
        error: error.error
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
