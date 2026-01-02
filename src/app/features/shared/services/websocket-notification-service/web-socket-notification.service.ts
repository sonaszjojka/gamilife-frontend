import { Injectable, inject, OnDestroy, Injector } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { environment } from '../../../../../environments/environment';
import { StorageService } from '../../../../shared/services/auth/storage.service';
import { NotificationType } from '../../models/notification/notification-type.enum';
import { AuthService } from '../../../../shared/services/auth/auth.service';

interface NotificationDtoFromBackend {
  id: string;
  notificationType: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

export interface NotificationDto {
  id: string;
  notificationType: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  data?: Record<string, unknown>;
  read?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class WebSocketNotificationService implements OnDestroy {
  private client: Client | null = null;
  private nzNotification = inject(NzNotificationService);
  private storage = inject(StorageService);
  private injector = inject(Injector);

  private connectedSubject = new BehaviorSubject<boolean>(false);
  public connected$: Observable<boolean> = this.connectedSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$: Observable<number> =
    this.unreadCountSubject.asObservable();

  private notificationsSubject = new BehaviorSubject<NotificationDto[]>(
    this.loadNotificationsFromStorage(),
  );
  public notifications$: Observable<NotificationDto[]> =
    this.notificationsSubject.asObservable();

  constructor() {
    this.updateUnreadCount(this.notificationsSubject.value);
  }

  private loadNotificationsFromStorage(): NotificationDto[] {
    const data = this.storage.getNotifications();
    if (data) {
      const notifications: NotificationDto[] = JSON.parse(data);
      this.updateUnreadCount(notifications);
      return notifications;
    }
    return [];
  }

  private saveNotificationsToStorage(notifications: NotificationDto[]): void {
    this.storage.setNotifications(JSON.stringify(notifications));
  }

  private updateUnreadCount(notifications: NotificationDto[]): void {
    const unreadCount = notifications.filter((n) => !n.read).length;
    this.unreadCountSubject.next(unreadCount);
  }

  connect(): void {
    if (this.client?.active) {
      return;
    }

    const wsUrl = environment.wsUrl;

    this.client = new Client({
      brokerURL: wsUrl,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        this.connectedSubject.next(true);
        this.subscribeToNotifications();
        this.updateUnreadCount(this.notificationsSubject.value);
      },

      onStompError: () => {
        this.connectedSubject.next(false);
      },

      onWebSocketError: () => {
        this.connectedSubject.next(false);
      },

      onDisconnect: () => {
        this.connectedSubject.next(false);
      },

      onWebSocketClose: () => {
        this.connectedSubject.next(false);
      },
    });

    this.client.activate();
  }

  private subscribeToNotifications(): void {
    if (!this.client || !this.client.connected) {
      return;
    }

    this.client.subscribe('/user/queue/notifications', (message: IMessage) => {
      const backendNotification: NotificationDtoFromBackend = JSON.parse(
        message.body,
      );
      const notification = this.convertNotification(backendNotification);

      if (
        notification.notificationType ===
        NotificationType.GAMIFICATION_VALUES_CHANGED
      ) {
        if (!notification.data) {
          return;
        }

        const authService = this.injector.get(AuthService);
        authService.updateGamificationData({
          userId: notification.data['userId'] as string,
          username: notification.data['username'] as string,
          level: notification.data['level'] as number,
          experience: notification.data['experience'] as number,
          money: notification.data['money'] as number,
          requiredExperienceForNextLevel: notification.data[
            'requiredExperienceForNextLevel'
          ] as number | null,
        });
        return;
      }

      const notificationWithRead: NotificationDto = {
        ...notification,
        read: false,
      };

      const currentNotifications = this.notificationsSubject.value;
      const newNotifications = [notificationWithRead, ...currentNotifications];

      this.notificationsSubject.next(newNotifications);
      this.saveNotificationsToStorage(newNotifications);
      this.updateUnreadCount(newNotifications);

      this.displayNotification(notification);
    });
  }

  private convertNotification(
    backendDto: NotificationDtoFromBackend,
  ): NotificationDto {
    const typeKey =
      backendDto.notificationType as keyof typeof NotificationType;
    const notificationType =
      NotificationType[typeKey] || NotificationType.OTHER;

    const { title, message } = this.getNotificationContent(
      notificationType,
      backendDto.data,
    );

    return {
      id: backendDto.id,
      notificationType: notificationType,
      title: title,
      message: message,
      timestamp: backendDto.timestamp,
      data: backendDto.data,
    };
  }

  private getNotificationContent(
    type: NotificationType,
    data?: Record<string, unknown>,
  ): { title: string; message: string } {
    switch (type) {
      case NotificationType.ACHIEVEMENT_UNLOCKED: {
        return {
          title: 'Achievement Unlocked!',
          message: `Congratulations! You unlocked: ${data?.['achievementName'] || ''}`,
        };
      }
      case NotificationType.ITEM_ACQUIRED: {
        const itemNames = data?.['itemNames'] as string[];
        let itemsList = 'a new item';

        if (itemNames && itemNames.length > 0) {
          if (itemNames.length === 1) {
            itemsList = itemNames[0];
          } else {
            itemsList = `${itemNames[0]} and ${itemNames.length - 1} more`;
          }
        }

        return {
          title: 'Item Acquired',
          message: `You received: ${itemsList}`,
        };
      }
      case NotificationType.LEVEL_UP:
        return {
          title: 'Level Up!',
          message: `Congratulations! You reached level ${data?.['level'] || ''}`,
        };
      case NotificationType.GROUP_INVITATION:
        return {
          title: 'Group Invitation',
          message: `You have been invited to join ${data?.['groupName'] || 'a group'}`,
        };
      case NotificationType.GROUP_ITEM_USED:
        return {
          title: 'Group Item Used',
          message: `${data?.['username'] || 'Someone'} used ${data?.['itemName'] || 'an item'}`,
        };
      case NotificationType.NEW_GROUP_MEMBER:
        return {
          title: 'New Group Member',
          message: `${data?.['username'] || 'A new member'} joined ${data?.['groupName'] || 'the group'}`,
        };
      case NotificationType.GROUP_MEMBER_LEFT:
        return {
          title: 'Member Left Group',
          message: `${data?.['username'] || 'A member'} left ${data?.['groupName'] || 'the group'}`,
        };
      case NotificationType.NEW_GROUP_MESSAGE:
        return {
          title: 'New Group Message',
          message: `New message in ${data?.['groupName'] || 'group chat'}`,
        };
      case NotificationType.GROUP_TASK_ASSIGNED:
        return {
          title: 'Group Task Assigned',
          message: `You have a new task: ${data?.['taskName'] || 'Untitled task'}`,
        };
      case NotificationType.GROUP_TASK_COMPLETED:
        return {
          title: 'Group Task Completed',
          message: `Task ${data?.['taskName'] || ''} has been finished`,
        };
      case NotificationType.GROUP_REQUEST_STATUS_UPDATED:
        return {
          title: 'Group Request Updated',
          message: `Your request to ${data?.['groupName'] || 'group'} was ${(data?.['accepted'] as boolean) ? 'accepted' : 'declined'}`,
        };
      case NotificationType.NEW_GROUP_REQUEST:
        return {
          title: 'New Group Request',
          message: `${data?.['username'] || 'Someone'} wants to join ${data?.['groupName'] || 'your group'}`,
        };
      case NotificationType.OTHER:
      default:
        return {
          title: 'Notification',
          message: 'You have a new update',
        };
    }
  }

  private displayNotification(notification: NotificationDto): void {
    const notificationConfig = {
      nzDuration: 4500,
      nzPlacement: 'topRight' as const,
      nzClass: 'custom-notification',
    };

    switch (notification.notificationType) {
      case NotificationType.GROUP_TASK_COMPLETED:
      case NotificationType.LEVEL_UP:
      case NotificationType.ITEM_ACQUIRED:
      case NotificationType.ACHIEVEMENT_UNLOCKED:
        this.nzNotification.success(
          notification.title,
          notification.message,
          notificationConfig,
        );
        break;
      case NotificationType.GROUP_INVITATION:
      case NotificationType.OTHER:
      default:
        this.nzNotification.info(
          notification.title,
          notification.message,
          notificationConfig,
        );
        break;
    }
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.connectedSubject.next(false);
    }
  }

  markAsRead(notificationId: string): void {
    const notifications = this.notificationsSubject.value.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n,
    );
    this.notificationsSubject.next(notifications);
    this.saveNotificationsToStorage(notifications);
    this.updateUnreadCount(notifications);
  }

  markAllAsRead(): void {
    const notifications = this.notificationsSubject.value.map((n) => ({
      ...n,
      read: true,
    }));
    this.notificationsSubject.next(notifications);
    this.saveNotificationsToStorage(notifications);
    this.unreadCountSubject.next(0);
  }

  clearNotification(notificationId: string): void {
    const notifications = this.notificationsSubject.value.filter(
      (n) => n.id !== notificationId,
    );
    this.notificationsSubject.next(notifications);
    this.saveNotificationsToStorage(notifications);
    this.updateUnreadCount(notifications);
  }

  clearAllNotifications(): void {
    this.notificationsSubject.next([]);
    this.storage.removeNotifications();
    this.unreadCountSubject.next(0);
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
