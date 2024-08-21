import { Routes } from '@angular/router';
import { BillingComponent } from './modules/billing/billing.component';

export const routes: Routes = [
    { path: 'billing', component: BillingComponent },
    { path: '', redirectTo: '/billing', pathMatch: 'full' },
  ];
