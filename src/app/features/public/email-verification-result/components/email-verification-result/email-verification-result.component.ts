import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../../shared/services/auth/auth.service';

@Component({
  selector: 'app-email-verification-result',
  imports: [
    NzButtonModule,
    NzResultModule,
    RouterLink,
    CommonModule,
    NzSpinComponent,
  ],
  templateUrl: './email-verification-result.component.html',
  styleUrl: './email-verification-result.component.css',
})
export class EmailVerificationResultComponent implements OnInit {
  protected status: 'loading' | 'success' | 'error' = 'loading';

  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');

    if (!code) {
      this.status = 'error';
      return;
    }

    this.authService
      .verfiyEmail(code)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.status = 'success';
        },
        error: () => {
          this.status = 'error';
        },
      });
  }
}
