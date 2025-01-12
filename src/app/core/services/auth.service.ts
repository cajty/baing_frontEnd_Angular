// auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Role } from '../models/role.enum';
import {LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User} from '../models/user.interface';
import { TokenService } from './token.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);


  private API_URL = `${environment.apiUrl}`;
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  private role = new BehaviorSubject<Role | null>(null);

  readonly currentUser$ = this.currentUserSubject.asObservable();
  readonly role$ = this.role.asObservable();

  private readonly redirectPaths: Record<Role, string> = {
    [Role.ADMIN]: '/admin/dashboard',
    [Role.USER]: '/user/profile',
    [Role.EMPLOYEE]: '/employee/support'
  };

  constructor() {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const token = this.tokenService.getAccessToken();
    if (token) {
      this.getCurrentUser().subscribe();
    }
  }

  private getRedirectPath(role: Role): string {
    return this.redirectPaths[role] || '/';
  }

  private handleAuthError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred during authentication';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      switch (error.status) {
        case 401:
          errorMessage = 'Invalid credentials';
          break;
        case 403:
          errorMessage = 'Access denied';
          break;
        case 404:
          errorMessage = 'Service not found';
          break;
        case 422:
          errorMessage = 'Invalid registration data';
          break;
        default:
          errorMessage = error.error?.message || `Error: ${error.status}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const sanitizedCredentials = {
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password
    };

    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, sanitizedCredentials)
      .pipe(
        tap((response: LoginResponse) => {
          this.tokenService.setTokens(response.token);
          this.setRole(response.role as Role);
          this.currentUserSubject.next(response.user);
          void this.router.navigate([this.getRedirectPath(response.role as Role)]);
        }),
        catchError(this.handleAuthError)
      );
  }

  register(user: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.API_URL}/auth/signup`, user)
      .pipe(
        catchError(this.handleAuthError)
      );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/auth/login-user`)
      .pipe(
        tap(user => {
          this.currentUserSubject.next(user);
          this.setRole(user.role as Role);
        }),
        catchError(this.handleAuthError)
      );
  }

  setRole(role: Role): void {
    this.role.next(role);
  }

  logout(): void {
    this.tokenService.clearTokens();
    this.currentUserSubject.next(null);
    this.role.next(null);
    void this.router.navigate(['/']);
  }

  hasRole(role: string): boolean {
    return this.role.getValue() === role;
  }

  isAuthenticated(): boolean {
    return this.tokenService.getAccessToken() !== null &&
      this.currentUserSubject.getValue() !== null;
  }
}
