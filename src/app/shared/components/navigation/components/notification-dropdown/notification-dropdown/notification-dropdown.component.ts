import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import {
  WebSocketNotificationService,
  NotificationDto,
} from '../../../../../../features/shared/services/websocket-notification-service/web-socket-notification.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    NzBadgeModule,
    NzDropDownModule,
    NzIconModule,
    NzButtonModule,
    NzListModule,
    NzEmptyModule,
    NzDividerModule,
  ],
  templateUrl: './notification-dropdown.component.html',
  styleUrls: ['./notification-dropdown.component.css'],
})
export class NotificationDropdownComponent {
  private notificationService = inject(WebSocketNotificationService);
  private router = inject(Router);

  unreadCount$: Observable<number> = this.notificationService.unreadCount$;
  notifications$: Observable<NotificationDto[]> =
    this.notificationService.notifications$;
  connected$: Observable<boolean> = this.notificationService.connected$;

  dropdownVisible = false;

  onDropdownVisibleChange(visible: boolean): void {
    this.dropdownVisible = visible;
    if (visible) {
      this.notificationService.markAllAsRead();
    }
  }
  handleNotificationClick(notification: NotificationDto): void {
    this.notificationService.markAsRead(notification.id);

    if (
      notification.notificationType === 'GROUP_INVITATION' &&
      notification.data &&
      notification.data['invitation-link']
    ) {
      const link = notification.data['invitation-link'] as string;

      if (link.startsWith('/')) {
        this.router.navigateByUrl(link);
      } else {
        window.location.href = link;
      }

      this.dropdownVisible = false;
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  clearNotification(notification: NotificationDto, event: Event): void {
    event.stopPropagation();
    this.notificationService.clearNotification(notification.id);
  }

  clearAll(): void {
    this.notificationService.clearAllNotifications();
  }

  isUnread(notification: NotificationDto): boolean {
    return !notification.read;
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'SUCCESS':
        return 'check-circle';
      case 'ERROR':
        return 'close-circle';
      case 'WARNING':
      case 'TASK_REMINDER':
        return 'exclamation-circle';
      case 'ACHIEVEMENT_UNLOCKED':
        return 'trophy';
      case 'LEVEL_UP':
        return 'arrow-up';
      case 'GROUP_INVITATION':
        return 'team';
      case 'NEW_MESSAGE':
        return 'message';
      case 'TASK_OVERDUE':
        return 'clock-circle';
      default:
        return 'bell';
    }
  }

  getNotificationIconColor(type: string): string {
    switch (type) {
      case 'SUCCESS':
      case 'ACHIEVEMENT_UNLOCKED':
      case 'LEVEL_UP':
        return '#52c41a';
      case 'ERROR':
      case 'TASK_OVERDUE':
        return '#ff4d4f';
      case 'WARNING':
      case 'TASK_REMINDER':
        return '#faad14';
      case 'INFO':
      case 'GROUP_INVITATION':
      case 'NEW_MESSAGE':
      default:
        return '#1890ff';
    }
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
  }
}
