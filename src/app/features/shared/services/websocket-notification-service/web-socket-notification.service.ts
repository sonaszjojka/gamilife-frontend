import { Injectable, inject, OnDestroy } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { environment } from '../../../../../environments/environment';

interface NotificationTypeEnum {
  id: number;
  name: string;
}

interface NotificationDtoFromBackend {
  id: string;
  notificationType: NotificationTypeEnum;
  title: string;
  message: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

export interface NotificationDto {
  id: string;
  notificationType: string;
  title: string;
  message: string;
  timestamp: string;
  data?: Record<string, unknown>;
  read?: boolean;
}

const NOTIFICATIONS_STORAGE_KEY = 'user_notifications';

@Injectable({
  providedIn: 'root',
})
export class WebSocketNotificationService implements OnDestroy {
  private client: Client | null = null;
  private nzNotification = inject(NzNotificationService);

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
    const data = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (data) {
      const notifications: NotificationDto[] = JSON.parse(data);
      this.updateUnreadCount(notifications);
      return notifications;
    }
    return [];
  }

  private saveNotificationsToStorage(notifications: NotificationDto[]): void {
    localStorage.setItem(
      NOTIFICATIONS_STORAGE_KEY,
      JSON.stringify(notifications),
    );
  }

  private updateUnreadCount(notifications: NotificationDto[]): void {
    const unreadCount = notifications.filter((n) => !n.read).length;
    this.unreadCountSubject.next(unreadCount);
  }
  connect(): void {
    if (this.client?.connected) {
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
        this.nzNotification.error(
          'Connection Error',
          'Failed to connect to notification service. Please refresh the page.',
          {
            nzDuration: 5000,
            nzPlacement: 'topRight',
            nzClass: 'custom-notification',
          },
        );
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
    if (!this.client) {
      return;
    }

    this.client.subscribe('/user/queue/notifications', (message: IMessage) => {
      const backendNotification: NotificationDtoFromBackend = JSON.parse(
        message.body,
      );

      const notification = this.convertNotification(backendNotification);

      const notificationWithRead: NotificationDto = {
        ...notification,
        read: false,
      };

      const currentNotifications = this.notificationsSubject.value;
      const newNotifications = [notificationWithRead, ...currentNotifications];

      this.notificationsSubject.next(newNotifications);
      this.saveNotificationsToStorage(newNotifications);

      this.unreadCountSubject.next(this.unreadCountSubject.value + 1);

      this.displayNotification(notification);
    });
  }

  private convertNotification(
    backendDto: NotificationDtoFromBackend,
  ): NotificationDto {
    const notificationType =
      typeof backendDto.notificationType === 'string'
        ? backendDto.notificationType
        : backendDto.notificationType.name || 'OTHER';

    return {
      id: backendDto.id,
      notificationType: notificationType,
      title: backendDto.title,
      message: backendDto.message,
      timestamp: backendDto.timestamp,
      data: backendDto.data,
    };
  }

  private displayNotification(notification: NotificationDto): void {
    const notificationConfig = {
      nzDuration: 4500,
      nzPlacement: 'topRight' as const,
      nzClass: 'custom-notification',
    };

    switch (notification.notificationType) {
      case 'TASK_COMPLETED': // TODO: updating money
      case 'LEVEL_UP':
        this.nzNotification.success(
          notification.title,
          notification.message,
          notificationConfig,
        );
        break;

      case 'ITEM_ACQUIRED':
        this.nzNotification.success(
          notification.title,
          notification.message,
          notificationConfig,
        );
        break;

      case 'GROUP_INVITATION':
        this.nzNotification.info(
          notification.title,
          notification.message,
          notificationConfig,
        );
        break;

      case 'OTHER':
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
    localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
    this.unreadCountSubject.next(0);
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
