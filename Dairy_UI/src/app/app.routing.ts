import { Routes } from '@angular/router';
import { BillingComponent } from './modules/billing/billing.component';
import { UserComponent } from './modules/user/user.component';
import {LoginComponent} from './modules/login/login.component'

export const routes: Routes = [
    
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'billing', component: BillingComponent },
    { path: 'login', component: LoginComponent },
    { path: 'user', component: UserComponent },

  ];
