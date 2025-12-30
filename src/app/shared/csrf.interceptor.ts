import {
  HttpInterceptorFn,
  HttpXsrfTokenExtractor,
} from '@angular/common/http';
import { inject } from '@angular/core';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenExtractor = inject(HttpXsrfTokenExtractor);
  const token = tokenExtractor.getToken();
  const csrfHeaderName = 'X-XSRF-TOKEN';

  if (token && !req.headers.has(csrfHeaderName)) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const cloned = req.clone({
        headers: req.headers.set(csrfHeaderName, token),
      });
      return next(cloned);
    }
  }

  return next(req);
};
