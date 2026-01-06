import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './shared/components/navigation/components/main-navbar/navigation.component';
import { FooterComponent } from './shared/components/footer/footer/footer.component';
import { NzLayoutComponent } from 'ng-zorro-antd/layout';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavigationComponent,
    FooterComponent,
    NzLayoutComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'gamilife-frontend';
}
