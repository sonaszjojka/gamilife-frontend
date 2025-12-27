import { HttpInterceptorFn } from '@angular/common/http';

export const timeZoneInterceptor: HttpInterceptorFn = (req, next) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const newReq = req.clone({
    setHeaders: {
      'X-Timezone': timeZone,
    },
  });

  return next(newReq);
};
