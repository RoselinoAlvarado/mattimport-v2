import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinancialPageRoutingModule } from './financial-routing.module';

import { FinancialPage } from './financial.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinancialPageRoutingModule
  ],
  declarations: [FinancialPage]
})
export class FinancialPageModule {}
