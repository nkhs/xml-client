import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import {
  FullLayoutComponent,
  SimpleLayoutComponent
} from './containers';

import { AccountListComponent } from 'app/views/account-list';
import { DashboardComponent } from 'app/views/dashboard/dashboard.component';
import { LoginComponent } from './views/auth/login/login.component';
import { AuthComponent } from './views/auth/auth.component';
import { AuthGuard, AdminGuard } from './services/index';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'account-list',
        component: AccountListComponent,
        data: {
          title: 'Account'
        },
        canActivate: [AdminGuard]
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          title: 'Dashboard'
        },
      }
      
    ],
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
