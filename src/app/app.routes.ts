import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth-guard/auth.guard';
import { GuestGuard } from './shared/guards/guest-guard/guest.guard';
import { environment } from '../environments/environment';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './features/public/guest-home/guest-home-page/guest-home-page.component'
      ).then((m) => m.GuestHomePageComponent),
    canActivate: [GuestGuard],
  },
  {
    path: 'about-us',
    loadComponent: () =>
      import(
        './features/public/about-us/about-us-page/about-us-page.component'
      ).then((m) => m.AboutUsPageComponent),
    canActivate: [GuestGuard],
  },
  {
    path: 'verify-email',
    loadComponent: () =>
      import(
        './features/public/email-verification-result/email-verification-result-page/email-verification-result-page.component'
      ).then((m) => m.EmailVerificationResultPageComponent),
    canActivate: [GuestGuard],
  },
  {
    path: 'reset-password-page',
    loadComponent: () =>
      import(
        './features/public/reset-password/reset-password-page/reset-password-page.component'
      ).then((m) => m.ResetPasswordPageComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/public/login/login-page/login-page.component').then(
        (m) => m.LoginPageComponent,
      ),
    canActivate: [GuestGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import(
        './features/public/registration/registration-page/registration-page.component'
      ).then((m) => m.RegistrationPageComponent),
    canActivate: [GuestGuard],
  },
  {
    path: 'forgot-password-page',
    loadComponent: () =>
      import(
        './features/public/login/components/forgot-password/forgot-password.component'
      ).then((m) => m.ForgotPasswordComponent),
    canActivate: [GuestGuard],
  },
  {
    path: `${environment.callbackUri}`,
    loadComponent: () =>
      import(
        './features/public/oauth2/oauth-callback/oauth-callback.component'
      ).then((m) => m.OAuthCallbackComponent),
  },
  {
    path: 'app',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            './features/private/dashboard/dashboard-page/dashboard-page.component'
          ).then((m) => m.DashboardPageComponent),
      },
      {
        path: 'tasks',
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './features/private/my-activities/my-activities-page/my-activities-page.component'
              ).then((m) => m.MyActivitiesPageComponent),
          },
          {
            path: 'pomodoro-session',
            loadComponent: () =>
              import(
                './features/private/pomodoro-session/pomodoro-session-page/pomodoro-session-page.component'
              ).then((m) => m.PomodoroSessionPageComponent),
          },
        ],
      },
      {
        path: 'community',
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './features/private/community/community-page/community-page.component'
              ).then((m) => m.CommunityPageComponent),
          },
          {
            path: 'groups/:groupId',
            loadComponent: () =>
              import(
                './features/private/group-preview/group-preview-page/group-preview-page.component'
              ).then((m) => m.GroupPreviewPageComponent),
          },
          {
            path: 'groups/:groupId/members',
            loadComponent: () =>
              import(
                './features/private/group-members/group-members-page/group-members-page.component'
              ).then((m) => m.GroupMembersPageComponent),
          },
          {
            path: 'groups/:groupId/requests',
            loadComponent: () =>
              import(
                './features/private/group-requests/group-requests-page/group-requests-page.component'
              ).then((m) => m.GroupRequestsPageComponent),
          },
          {
            path: 'groups/:groupId/group-invitations/:groupInvitationId',
            loadComponent: () =>
              import(
                './features/private/group-invitation-response/group-invitation-response-page/group-invitation-response-page.component'
              ).then((m) => m.GroupInvitationResponsePageComponent),
          },
          {
            path: 'groups/:groupId/ranking',
            loadComponent: () =>
              import(
                './features/private/group-ranking/group-ranking-page/group-ranking-page.component'
              ).then((m) => m.GroupRankingPageComponent),
          },
          {
            path: 'users/:userId',
            loadComponent: () =>
              import(
                './features/private/user-profile/user-profile-page/user-profile-page.component'
              ).then((m) => m.UserProfilePageComponent),
          },
        ],
      },
      {
        path: 'store',
        loadComponent: () =>
          import(
            './features/private/store/store-page/store-page.component'
          ).then((m) => m.StorePageComponent),
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './features/private/user-profile/user-profile-page/user-profile-page.component'
              ).then((m) => m.UserProfilePageComponent),
          },
          {
            path: 'change-password',
            loadComponent: () =>
              import(
                './features/private/change password/change-password-page/change-password-page.component'
              ).then((m) => m.ChangePasswordPageComponent),
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
