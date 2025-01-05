import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ClientViewComponent} from "./pages/client-view/client-view.component";
import {OperationsComponent} from "./pages/operations/operations.component";
import {SupportComponent} from "./pages/support/support.component";

const routes: Routes = [
  {
    path: 'client-view',
    component: ClientViewComponent

  },
  {
    path: 'operation',
    component: OperationsComponent

  },
  {
    path: 'support',
    component: SupportComponent

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
