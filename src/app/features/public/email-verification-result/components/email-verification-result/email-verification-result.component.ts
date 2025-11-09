import { Component, inject, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { NzSpinComponent } from 'ng-zorro-antd/spin';

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

  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/auth/email-verifications/confirm`;
  private route = inject(ActivatedRoute);
  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');

    if (!code) {
      this.status = 'error';
      return;
    }

    this.http.post(this.apiUrl, { code }).subscribe({
      next: () => {
        this.status = 'success';
      },
      error: () => {
        this.status = 'error';
      },
    });
  }
}
