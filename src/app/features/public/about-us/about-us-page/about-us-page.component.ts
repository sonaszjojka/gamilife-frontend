import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [NzCardModule, NzIconModule, NzButtonModule, RouterModule],
  templateUrl: './about-us-page.component.html',
  styleUrls: ['./about-us-page.component.css'],
})
export class AboutUsPageComponent {
  private router = inject(Router);

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
