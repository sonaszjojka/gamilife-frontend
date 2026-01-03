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
import { NotificationType } from '../../../../../../features/shared/models/notification/notification-type.enum';

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

    switch (notification.notificationType) {
      case NotificationType.GROUP_INVITATION:
        this.handleGroupInvitation(notification.data);
        break;
      case NotificationType.ACHIEVEMENT_UNLOCKED:
      case NotificationType.ITEM_ACQUIRED:
      case NotificationType.LEVEL_UP:
        this.handleRedirectToProfile();
        break;
      case NotificationType.NEW_GROUP_REQUEST:
        this.handleRedirectToGroupRequests(notification.data);
        break;
      case NotificationType.NEW_GROUP_MEMBER:
      case NotificationType.GROUP_MEMBER_LEFT:
      case NotificationType.NEW_GROUP_MESSAGE:
      case NotificationType.GROUP_TASK_ASSIGNED:
      case NotificationType.GROUP_TASK_COMPLETED:
      case NotificationType.GROUP_REQUEST_STATUS_UPDATED:
      case NotificationType.GROUP_ITEM_USED:
        this.handleRedirectToGroupPage(notification.data);
        break;
      default:
        break;
    }
  }

  private handleGroupInvitation(
    data: Record<string, unknown> | undefined,
  ): void {
    if (!data) {
      return;
    }

    const groupInvitationId = data['groupInvitationId'] as string;
    const groupId = data['groupId'] as string;
    const token = data['token'] as string;

    if (!groupInvitationId || !groupId || !token) {
      return;
    }

    const invitationLink = `/app/groups/${groupId}/group-invitations/${groupInvitationId}?token=${token}`;
    this.router.navigateByUrl(invitationLink);

    this.dropdownVisible = false;
  }

  private handleRedirectToProfile(): void {
    this.router.navigate(['app/profile']);
    this.dropdownVisible = false;
  }

  private handleRedirectToGroupRequests(
    data: Record<string, unknown> | undefined,
  ): void {
    if (!data) {
      return;
    }

    const groupId = data['groupId'] as string;
    if (groupId) {
      this.router.navigate([`app/groups/${groupId}/requests`]);
      this.dropdownVisible = false;
    }
  }

  private handleRedirectToGroupPage(
    data: Record<string, unknown> | undefined,
  ): void {
    if (!data) {
      return;
    }

    const groupId = data['groupId'] as string;
    if (groupId) {
      this.router.navigate([`app/groups/${groupId}`]);
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

  getNotificationIcon(type: NotificationType): string {
    switch (type) {
      case NotificationType.ACHIEVEMENT_UNLOCKED:
        return 'trophy';
      case NotificationType.ITEM_ACQUIRED:
      case NotificationType.GROUP_ITEM_USED:
        return 'gift';
      case NotificationType.LEVEL_UP:
        return 'up-circle';
      case NotificationType.GROUP_INVITATION:
      case NotificationType.NEW_GROUP_MEMBER:
      case NotificationType.NEW_GROUP_REQUEST:
        return 'contacts';
      case NotificationType.GROUP_MEMBER_LEFT:
        return 'minus-circle';
      case NotificationType.NEW_GROUP_MESSAGE:
        return 'message';
      case NotificationType.GROUP_TASK_ASSIGNED:
        return 'schedule';
      case NotificationType.GROUP_TASK_COMPLETED:
        return 'check-circle';
      case NotificationType.GROUP_REQUEST_STATUS_UPDATED:
        return 'info-circle';
      case NotificationType.OTHER:
      default:
        return 'bell';
    }
  }

  getNotificationIconColor(type: NotificationType): string {
    switch (type) {
      case NotificationType.ACHIEVEMENT_UNLOCKED:
      case NotificationType.LEVEL_UP:
      case NotificationType.GROUP_TASK_COMPLETED:
        return '#52c41a';
      case NotificationType.ITEM_ACQUIRED:
        return '#faad14';
      case NotificationType.GROUP_ITEM_USED:
        return '#722ed1';
      case NotificationType.GROUP_MEMBER_LEFT:
        return '#ff4d4f';
      case NotificationType.NEW_GROUP_MESSAGE:
      case NotificationType.GROUP_INVITATION:
      case NotificationType.NEW_GROUP_MEMBER:
      case NotificationType.NEW_GROUP_REQUEST:
      case NotificationType.GROUP_TASK_ASSIGNED:
      case NotificationType.GROUP_REQUEST_STATUS_UPDATED:
      case NotificationType.OTHER:
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
