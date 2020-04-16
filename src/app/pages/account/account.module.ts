import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { ProductsModule } from 'src/app/modules/products/products.module';
import { UserComponent } from './user/user.component';


@NgModule({
  declarations: [
    AccountComponent,
    UserComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedModule,
    MaterialModule,
    ProductsModule,
  ]
})
export class AccountModule { }
