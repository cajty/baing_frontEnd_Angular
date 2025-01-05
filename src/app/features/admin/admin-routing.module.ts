import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {UserManagementComponent} from "./pages/user-management/user-management.component";

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent

  },
  {
    path: 'user-management',
    component: UserManagementComponent

  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
