import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinancialPage } from './financial.page';

const routes: Routes = [
  {
    path: '',
    component: FinancialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialPageRoutingModule {}
