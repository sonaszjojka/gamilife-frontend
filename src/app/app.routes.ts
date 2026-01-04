import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth-guard/auth.guard';
import { GuestGuard } from './shared/guards/guest-guard/guest.guard';
import { environment } from '../environments/environment';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './features/public/guest-home/components/guest-home/guest-home.component'
      ).then((m) => m.GuestHomeComponent),
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
        './features/public/email-verification-result/components/email-verification-result/email-verification-result.component'
      ).then((m) => m.EmailVerificationResultComponent),
    canActivate: [GuestGuard],
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import(
        './features/public/reset-password/components/reset-password/reset-password.component'
      ).then((m) => m.ResetPasswordComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/public/login/components/login/login.component').then(
        (m) => m.LoginComponent,
      ),
    canActivate: [GuestGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import(
        './features/public/registration/components/registration/registration.component'
      ).then((m) => m.RegistrationComponent),
    canActivate: [GuestGuard],
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import(
        './features/public/forgot-password/components/forgot-password/forgot-password.component'
      ).then((m) => m.ForgotPasswordComponent),
    canActivate: [GuestGuard],
  },
  {
    path: `${environment.callbackUri}`,
    loadComponent: () =>
      import(
        './features/public/oauth2/components/oauth-callback/oauth-callback.component'
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
            './features/private/dashboard/components/dashboard/dashboard.component'
          ).then((m) => m.DashboardComponent),
      },
      {
        path: 'tasks',
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './features/private/my-tasks/task-list/task-list.component'
              ).then((m) => m.TaskListComponent),
          },
          {
            path: 'pomodoro-session',
            loadComponent: () =>
              import(
                './features/private/my-tasks/pomodoro-session/pomodoro-session.component'
              ).then((m) => m.PomodoroSessionComponent),
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
                './features/private/community/components/community-page/community-page.component'
              ).then((m) => m.CommunityPageComponent),
          },
          {
            path: 'groups/:groupId',
            loadComponent: () =>
              import(
                './features/private/shared/components/preview-group/preview-group.component'
              ).then((m) => m.PreviewGroupComponent),
          },
          {
            path: 'groups/:groupId/members',
            loadComponent: () =>
              import(
                './features/private/group-members-page/components/group-members-page/group-members-page.component'
              ).then((m) => m.GroupMembersPageComponent),
          },
          {
            path: 'groups/:groupId/requests',
            loadComponent: () =>
              import(
                './features/private/group-requests-page/components/group-requests-page/group-requests-page.component'
              ).then((m) => m.GroupRequestsPageComponent),
          },
          {
            path: 'groups/:groupId/group-invitations/:groupInvitationId',
            loadComponent: () =>
              import(
                './features/private/my-groups/components/group-invitation-response/group-invitation-response.component'
              ).then((m) => m.GroupInvitationResponseComponent),
          },
          {
            path: 'groups/:groupId/ranking',
            loadComponent: () =>
              import(
                './features/private/group-ranking-page/components/group-ranking-page/group-ranking-page.component'
              ).then((m) => m.GroupRankingPageComponent),
          },
          {
            path: 'users/:userId',
            loadComponent: () =>
              import(
                './features/private/user-profile/components/user-profile-page/user-profile-page.component'
              ).then((m) => m.UserProfilePageComponent),
          },
        ],
      },
      {
        path: 'my-groups',
        loadComponent: () =>
          import(
            './features/private/my-groups/components/my-groups-page/my-groups-page.component'
          ).then((m) => m.MyGroupsPageComponent),
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
        loadComponent: () =>
          import(
            './features/private/user-profile/components/user-profile-page/user-profile-page.component'
          ).then((m) => m.UserProfilePageComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
