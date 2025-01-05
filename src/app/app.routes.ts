import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import {Role} from "./core/models/role.enum";




export const routes: Routes = [
  {
    path: 'auth',
     title: 'Auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    title: 'Admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [authGuard, roleGuard],
    data: { role: Role.ADMIN }
  },
  {
    path: 'user',
    title: 'User',
    loadChildren: () => import('./features/user/user.module').then(m => m.UserModule),
    canActivate: [authGuard, roleGuard],
    data: { role: Role.USER }
  },
  {
    path: 'employee',
    title: 'Employee',
    loadChildren: () => import('./features/employee/employee.module').then(m => m.EmployeeModule),
    canActivate: [authGuard, roleGuard],
    data: { role: Role.EMPLOYEE }
  }
];


