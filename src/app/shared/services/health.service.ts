import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NotificationService } from '../../features/shared/services/notification-service/notification.service';

export interface HealthStatus {
  status: 'UP' | 'DOWN';
  timestamp?: string;
}

@Injectable({
  providedIn: 'root',
})
export class HealthService {
  private readonly http = inject(HttpClient);
  private notificationService = inject(NotificationService);

  readonly healthStatus = signal<HealthStatus>({ status: 'DOWN' });

  checkHealth(): Observable<HealthStatus> {
    return this.http.get<HealthStatus>('/actuator/health/').pipe(
      map((response) => {
        const status: HealthStatus = {
          status: 'UP',
          timestamp: response.timestamp,
        };
        this.healthStatus.set(status);
        return status;
      }),
      catchError(() => {
        const status: HealthStatus = { status: 'DOWN' };
        this.notificationService.error(
          'Server is unavailable. Try again later.',
        );

        this.healthStatus.set(status);
        return of(status);
      }),
    );
  }
}
