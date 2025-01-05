import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AccountsComponent} from "./pages/accounts/accounts.component";
import {ProfileComponent} from "./pages/profile/profile.component";
import {TransactionsComponent} from "./pages/transactions/transactions.component";


const routes: Routes = [
  {

    path: 'account',
    component: AccountsComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'transaction',
    component: TransactionsComponent
  }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
