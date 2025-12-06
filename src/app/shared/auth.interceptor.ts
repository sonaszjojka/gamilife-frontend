import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const cloned = req.clone({ withCredentials: true });

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      const code = Number(error.error?.code);
      const url = req.url;

      if (error.status === 401 || error.status === 403) {
        const isAuthEndpoint = url.includes('/auth/refresh');

        if (code === 2002 || code === 2003 || code === 1020) {
          authService.logoutLocal();
          return throwError(() => error);
        }

        if ((code === 1019 || code === 2013) && !isAuthEndpoint) {
          return authService.refreshToken().pipe(
            switchMap(() => next(cloned)),
            catchError(() => {
              authService.logoutLocal();
              return throwError(() => error);
            }),
          );
        }
      }

      return throwError(() => error);
    }),
  );
};
