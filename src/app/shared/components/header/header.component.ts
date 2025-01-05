import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal, computed, effect } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { User } from "../../../core/models/user.interface";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // Inject services using the new inject syntax
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Create signals for reactive state management
  currentUser = signal<User | null>(null);
  isLoggedIn = computed(() => this.currentUser() !== null);

  constructor() {
    // Subscribe to auth state changes using the new takeUntilDestroyed operator
    // This automatically handles cleanup when the component is destroyed
    this.authService.currentUser$
      .pipe(takeUntilDestroyed())
      .subscribe(user => {
        this.currentUser.set(user);
      });
  }

  ngOnInit(): void {
    // Initialize the component by checking the current auth state
    if (this.authService.isAuthenticated()) {
      this.authService.getCurrentUser().subscribe();
    }
  }

  logout(): void {
    // Call the auth service logout method
    this.authService.logout();

    // Navigate to login page and handle any potential navigation errors
    this.router.navigate(['/auth/login'])
      .catch((error: unknown) => {
        console.error('Navigation failed:', error);
        // You might want to show a user-friendly error message here
      });
  }
}
