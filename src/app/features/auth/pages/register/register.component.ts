import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TokenService } from '../../../../core/services/token.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterLink
  ],
  providers: [
    TokenService,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
      age: [null, [Validators.required, Validators.min(18), Validators.max(80)]],
      monthlyIncome: [0, [Validators.min(0)]],
      creditScore: [0, [Validators.min(0)]],
      role: ['USER', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.error = null;

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {

        this.isLoading = false;
        this.router.navigate(['auth/login']);
      },
      error: (error) => {
        this.isLoading = false;
        this.error = error.error?.message || 'An error occurred during registration';
      }
    });
  }
}
