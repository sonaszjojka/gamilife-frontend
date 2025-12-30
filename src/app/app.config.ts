import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
  provideAppInitializer,
  inject,
} from '@angular/core';
import {
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';

import { routes } from './app.routes';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideHttpClient,
  withInterceptors,
  withXsrfConfiguration,
} from '@angular/common/http';
import { authInterceptor } from './shared/auth.interceptor';
import { csrfInterceptor } from './shared/csrf.interceptor';
import { NZ_CONFIG, NzConfig } from 'ng-zorro-antd/core/config';
import { timeZoneInterceptor } from './shared/time-zone.interceptor';
import { HealthService } from './shared/services/health.service';
import { lastValueFrom } from 'rxjs';

registerLocaleData(en);

const ngZorroConfig: NzConfig = {
  message: {
    nzDuration: 3000,
    nzMaxStack: 5,
    nzPauseOnHover: false,
    nzAnimate: true,
    nzTop: '88px',
  },
  notification: {
    nzPlacement: 'topRight',
    nzTop: '88px',
    nzDuration: 4500,
    nzMaxStack: 3,
    nzPauseOnHover: true,
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideNzI18n(en_US),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([authInterceptor, csrfInterceptor, timeZoneInterceptor]),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      }),
    ),
    provideAppInitializer(() => {
      const healthService = inject(HealthService);
      return lastValueFrom(healthService.checkHealth());
    }),
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
  ],
};
