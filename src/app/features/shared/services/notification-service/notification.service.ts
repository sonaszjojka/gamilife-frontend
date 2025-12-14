import { Injectable, inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private message = inject(NzMessageService);

  handleApiError(
    error: { status: number; message: string },
    customMessage?: string,
  ): void {
    if (error.status === 0) {
      this.showNetworkError();
    } else if (error.status === 400) {
      this.showValidationError();
    } else if (error.status === 401 || error.status === 403) {
      this.showUnauthorizedError();
    } else if (error.status === 404) {
      this.error('Resource not found');
    } else if (error.status === 500) {
      this.error('Server error occurred');
    } else {
      this.error(customMessage || error.message || 'An error occurred');
    }
  }

  handleApiSuccess(
    method: 'POST' | 'PUT' | 'DELETE',
    customMessage?: string,
  ): void {
    switch (method) {
      case 'POST':
        this.success(customMessage || 'Created successfully');
        break;
      case 'PUT':
        this.success(customMessage || 'Updated successfully');
        break;
      case 'DELETE':
        this.showDeleteSuccess();
        break;
    }
  }

  success(text: string, duration = 3000): void {
    this.message.create('success', text, { nzDuration: duration });
  }

  error(text: string, duration = 3000): void {
    this.message.create('error', text, { nzDuration: duration });
  }

  info(text: string, duration = 3000): void {
    this.message.create('info', text, { nzDuration: duration });
  }

  warning(text: string, duration = 3000): void {
    this.message.create('warning', text, { nzDuration: duration });
  }

  loading(text: string, duration = 3000): void {
    this.message.create('loading', text, { nzDuration: duration });
  }

  removeAll(): void {
    this.message.remove();
  }

  showSaveSuccess(): void {
    this.success('Data saved successfully');
  }

  showSaveError(): void {
    this.error('Failed to save data');
  }

  showDeleteSuccess(): void {
    this.success('Deleted successfully');
  }

  showDeleteError(): void {
    this.error('Failed to delete');
  }

  showLoadError(): void {
    this.error('Failed to load data');
  }

  showNetworkError(): void {
    this.error('Network connection error');
  }

  showValidationError(): void {
    this.warning('Please check the entered data');
  }

  showUnauthorizedError(): void {
    this.error('You do not have permission to perform this action');
  }
}
