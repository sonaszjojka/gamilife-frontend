import { Routes } from '@angular/router';
import { LoginComponent } from './features/public/login/components/login/login.component';
import { RegistrationComponent } from './features/public/registration/components/registration/registration.component';
import { GuestHomeComponent } from './features/public/guest-home/components/guest-home/guest-home.component';
import { DashboardComponent } from './features/private/dashboard/components/dashboard/dashboard.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { ForgotPasswordComponent } from './features/public/forgot-password/components/forgot-password/forgot-password.component';
import { OAuthCallbackComponent } from './features/public/oauth2/components/oauth-callback/oauth-callback.component';
import { TaskListComponent } from './features/shared/tasks/component/task-list/task-list.component';
import { environment } from '../environments/environment';
import { GuestGuard } from './shared/guards/guest.guard';
import { EmailVerificationResultComponent } from './features/public/email-verification-result/components/email-verification-result/email-verification-result.component';
import { ResetPasswordComponent } from './features/public/reset-password/components/reset-password/reset-password.component';

export const routes: Routes = [
  {
    path: '',
    component: GuestHomeComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'verify-email',
    component: EmailVerificationResultComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'register',
    component: RegistrationComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [GuestGuard],
  },
  {
    path: `${environment.callbackUri}`,
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
