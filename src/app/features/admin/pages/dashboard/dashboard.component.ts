import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';
import {User, UserRequest} from '../../../../core/models/user.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  users: User[] = [];
  loading = true;
  error: string | null = null;
  showModal = false;
  isEditing = false;

  currentUser: UserRequest = {
    name: '',
    age: 0,
    monthlyIncome: 0,
    creditScore: 0,
    role: ''
  };

  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.userService.getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.users = users;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.error = 'Failed to load users. Please try again.';
          this.loading = false;
        }
      });
  }

  openAddModal(): void {
    this.isEditing = false;
    this.currentUser = {
      name: '',
      age: 0,
      monthlyIncome: 0,
      creditScore: 0,
      role: ''
    };
    this.showModal = true;
  }

  openEditModal(user: User): void {
    this.isEditing = true;
    this.currentUser = {
      name: user.name,
      age: user.age,
      monthlyIncome: user.monthlyIncome,
      creditScore: user.creditScore,
      role: user.role
    };
    this.showModal = true;
  }

  saveUser(): void {
    if (this.validateUser()) {
      this.userService.createUser(this.currentUser)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadUsers();
            this.showModal = false;
          },
          error: (error) => {
            console.error('Error saving user:', error);
            this.error = 'Failed to save user. Please try again.';
          }
        });
    }
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadUsers();
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            this.error = 'Failed to delete user. Please try again.';
          }
        });
    }
  }

  private validateUser(): boolean {
    if (!this.currentUser.name ||
      this.currentUser.age <= 0 ||
      this.currentUser.monthlyIncome < 0 ||
      this.currentUser.creditScore < 300 ||
      this.currentUser.creditScore > 850 ||
      !this.currentUser.role) {
      this.error = 'Please fill all fields with valid values.';
      return false;
    }
    return true;
  }

  getCreditScoreClass(score: number): string {
    if (score >= 700) return 'text-green-600';
    if (score >= 600) return 'text-yellow-600';
    return 'text-red-600';
  }
}
