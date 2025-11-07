import { Routes } from '@angular/router';
import { LoginComponent } from './features/public/login/components/login/login.component';
import { RegistrationComponent } from './features/public/registration/components/registration/registration.component';
import { GuestHomeComponent } from './features/public/guest-home/components/guest-home/guest-home.component';
import { LayoutComponent } from './features/private/dashboard/components/layout/layout.component';
import { DashboardComponent } from './features/private/dashboard/components/dashboard/dashboard.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { ForgotPasswordComponent } from './features/public/forgot-password/components/forgot-password/forgot-password.component';
import { OAuthCallbackComponent } from './features/public/oauth2/components/oauth-callback/oauth-callback.component';
import {TaskListComponent} from './features/shared/tasks/component/task-list/task-list.component';
import {AppComponent} from './app.component';

export const routes: Routes = [
  { path: '', component: GuestHomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'oauth/callback',
    component: OAuthCallbackComponent,
  },
  {
    path: 'app',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'tasks', component: TaskListComponent },
    ],
  },


  { path: '**', redirectTo: '' },
];
