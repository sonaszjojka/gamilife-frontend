import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { ErrorCode } from '../features/shared/models/error-codes/error-codes.enum';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const cloned = req.clone({ withCredentials: true });

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      const code = Number(error.error?.code);
      const url = req.url;

      if (error.status === 401 || error.status === 403) {
        const isAuthEndpoint = url.includes('/auth/refresh');

        if (
          code === ErrorCode.TOKEN_EXPIRED ||
          code === ErrorCode.INVALID_TOKEN ||
          code === ErrorCode.ACCOUNT_LOCKED
        ) {
          authService.logoutLocal();
          return throwError(() => error);
        }

        if (
          (code === ErrorCode.ACCESS_TOKEN_EXPIRED ||
            code === ErrorCode.REFRESH_TOKEN_EXPIRED) &&
          !isAuthEndpoint
        ) {
          return authService.refreshToken().pipe(
            switchMap(() => next(cloned)),
            catchError((refreshError) => {
              authService.logoutLocal();
              return throwError(() => refreshError);
            }),
          );
        }

        if (
          code === ErrorCode.MISSING_ACCESS_TOKEN_COOKIE ||
          code === ErrorCode.MISSING_REFRESH_TOKEN_COOKIE ||
          code === ErrorCode.MISSING_REQUEST_COOKIE
        ) {
          authService.logoutLocal();
          return throwError(() => error);
        }

        if (
          code === ErrorCode.ACCESS_DENIED ||
          code === ErrorCode.GROUP_ADMIN_PRIVILEGES_REQUIRED ||
          code === ErrorCode.RESOURCE_OWNER_PRIVILEGES_REQUIRED
        ) {
          return throwError(() => error);
        }
      }

      return throwError(() => error);
    }),
  );
};
