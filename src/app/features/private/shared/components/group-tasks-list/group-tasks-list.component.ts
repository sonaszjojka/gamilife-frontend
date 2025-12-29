import {
  Component, DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { GroupTaskFormComponent } from '../group-task-from/group-task-form.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { GroupTaskApiService } from '../../../../shared/services/group-task-api/group-task-api.service';
import {
  GetGroupTasksParams,
  GroupTask,
} from '../../../../shared/models/group/group-task.model';
import { Group } from '../../../../shared/models/group/group.model';
import { GroupPreviewMode } from '../../../../shared/models/group/group-preview-mode';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { GroupTaskComponent } from '../group-task/group-task.component';
import { GroupMember } from '../../../../shared/models/group/group-member.model';
import { Page } from '../../../../shared/models/util/page.model';
import { NotificationService } from '../../../../shared/services/notification-service/notification.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-group-task-list',
  standalone: true,
  templateUrl: 'group-tasks-list.component.html',
  styleUrl: 'group-tasks-list.component.css',
  imports: [
    CommonModule,
    NzSpinModule,
    NzCardModule,
    NzIconModule,
    NzListModule,
    NzButtonModule,
    NzModalModule,
    GroupTaskComponent,
    GroupTaskFormComponent,
  ],
})
export class GroupTasksListComponent implements OnInit {
  mode = input.required<GroupPreviewMode>();
  group = input.required<Group>();
  groupId = input.required<string>();
  groupMembersList = input.required<GroupMember[]>();

  refreshGroup = output<void>();

  protected currentPage = signal<number>(0);
  protected totalPages = signal<number>(1);
  protected loadingMore = signal<boolean>(false);
  protected loading = signal<boolean>(true);
  protected tasksList = signal<GroupTask[]>([]);
  protected tasksRequestParams: GetGroupTasksParams = {
    isAccepted: false,
    isDeclined: false,
    page: 0,
    size: 5,
  };

  private readonly groupTaskApi = inject(GroupTaskApiService);
  private readonly notification = inject(NotificationService);
  protected readonly GroupPreviewMode = GroupPreviewMode;
  private destroyRef = inject(DestroyRef)

  @ViewChild(GroupTaskFormComponent)
  groupTaskForm!: GroupTaskFormComponent;

  ngOnInit() {
    this.loadGroupTasks();
  }

  private loadGroupTasks(): void {
    const groupId = this.groupId();
    if (!groupId) return;

    this.groupTaskApi
      .getGroupTasks(groupId, this.tasksRequestParams)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tasks) => {
          this.tasksList.set(tasks.content);
          this.currentPage.set(tasks.number);
          this.totalPages.set(tasks.totalPages);
          this.loading.set(false);
        },
        error: (err) => {
          this.notification.handleApiError(err, 'Failed to load group tasks');
          this.tasksList.set([]);
          this.loading.set(false);
        },
      });
  }

  loadMoreTasks(): void {
    if ((this.currentPage()+1>=this.totalPages()) || this.loadingMore()) return;
    this.loadingMore.set(true);
    const nexPage = this.tasksRequestParams.page + 1;

    const nexPageParams = {
      size: this.tasksRequestParams.size,
      page: nexPage,
      isAccepted: this.tasksRequestParams.isAccepted,
      isDeclined: this.tasksRequestParams.isDeclined,
    };
    this.groupTaskApi.getGroupTasks(this.groupId(), nexPageParams)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: (response: Page<GroupTask>) => {
        this.tasksList.update((currentTasks) => [
          ...currentTasks,
          ...response.content,
        ]);
        this.tasksRequestParams.page = response.number;
        this.loadingMore.set(false);
      },
      error: (error) => {
        this.notification.handleApiError(error, 'Failed to load more tasks');
        this.loadingMore.set(false);
      },
    });
  }

  onListScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const threshold = 100;

    const isNearEnd =
      target.scrollTop + target.clientHeight >= target.scrollHeight - threshold;

    if (isNearEnd && !this.loading() && !this.loadingMore() && (this.currentPage()+1<this.totalPages())) {
      this.loadMoreTasks();
    }
  }

  public onTaskListUpdate() {
    this.tasksRequestParams.page = 0;
    this.loadGroupTasks();
  }

  public onGroupRefresh() {
    this.tasksRequestParams.page = 0;
    this.loadGroupTasks();
    this.refreshGroup.emit();
  }

  protected createTask(): void {
    if (this.groupTaskForm) {
      this.groupTaskForm.openForm();
    }
  }

  protected onActiveTasks(): void {
    this.tasksRequestParams.page = 0;
    this.tasksRequestParams.isAccepted = false;
    this.tasksRequestParams.isDeclined = false;
    this.loadGroupTasks();
  }

  protected onAcceptedTasks(): void {
    this.tasksRequestParams.page = 0;
    this.tasksRequestParams.isAccepted = true;
    this.tasksRequestParams.isDeclined = false;
    this.loadGroupTasks();
  }

  protected onDeclinedTasks(): void {
    this.tasksRequestParams.page = 0;
    this.tasksRequestParams.isAccepted = false;
    this.tasksRequestParams.isDeclined = true;
    this.loadGroupTasks();
  }
}
