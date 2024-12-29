import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { SessionGuard } from './core/guards/session.guard';
import {LoginComponent} from "./features/auth/pages/login/login.component";
import {RegisterComponent} from "./features/auth/pages/register/register.component";


export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
  },
  {
    path: 'user',
    loadChildren: () => import('./features/user/user.module').then(m => m.UserModule),
  },
  {
    path: 'employee',
    loadChildren: () => import('./features/employee/employee.module').then(m => m.EmployeeModule),
  }



];

/* Feature module routes should be defined in their respective routing modules:

AuthModule routes (auth-routing.module.ts):
{
  path: 'login',
  component: LoginComponent
},
{
  path: 'register',
  component: RegisterComponent
}

AdminModule routes (admin-routing.module.ts):
{
  path: 'dashboard',
  component: DashboardComponent
},
{
  path: 'user-management',
  component: UserManagementComponent
}

UserModule routes (user-routing.module.ts):
{
  path: 'profile',
  component: ProfileComponent
},
{
  path: 'accounts',
  component: AccountsComponent
},
{
  path: 'transactions',
  component: TransactionsComponent
}

EmployeeModule routes (employee-routing.module.ts):
{
  path: 'client-view',
  component: ClientViewComponent
},
{
  path: 'support',
  component: SupportComponent
},
{
  path: 'operations',
  component: OperationsComponent
}
*/
