import { Routes } from '@angular/router';
import { BillingComponent } from './modules/billing/billing.component';
import { UserComponent } from './modules/user/user.component';

export const routes: Routes = [
    { path: 'billing', component: BillingComponent },
    { path: '', redirectTo: '/billing', pathMatch: 'full' },
    { path: 'user', component: UserComponent },

  ];
