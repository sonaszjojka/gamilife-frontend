import { Component, inject, OnInit, signal } from '@angular/core';
import { Group } from '../../../../shared/models/group.model';
import { GroupApiService } from '../../../../shared/services/groups-api/group-api.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { GroupPreviewMode } from '../../../../shared/models/group-preview-mode';
import { take } from 'rxjs/operators';
import { GroupInfoCardComponent } from '../group-info-card/group-info-card.component';
import { GroupActionsComponent } from '../group-actions/group-actions.component';

@Component({
  selector: 'app-preview-group',
  standalone: true,
  imports: [
    CommonModule,
    NzSpinModule,
    NzCardModule,
    NzIconModule,
    GroupInfoCardComponent,
    GroupActionsComponent,
  ],
  templateUrl: './preview-group.component.html',
  styleUrls: ['./preview-group.component.css'],
})
export class PreviewGroupComponent implements OnInit {
  mode = signal<GroupPreviewMode>(GroupPreviewMode.PUBLIC);

  protected group = signal<Group | undefined>(undefined);
  protected groupId = signal<string | undefined>(undefined);
  protected loading = signal<boolean>(true);

  private readonly groupApi = inject(GroupApiService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('groupId');
    if (!id) return;

    this.groupId.set(id);
    this.loadGroup();
  }

  private loadGroup(): void {
    this.loading.set(true);

    this.groupApi
      .getGroupById(this.groupId()!, true)
      .pipe(take(1))
      .subscribe({
        next: (group) => {
          this.group.set(group);
          this.mode.set(
            group.isMember === true
              ? GroupPreviewMode.MEMBER
              : GroupPreviewMode.PUBLIC,
          );
          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.loading.set(false);
        },
      });
  }

  protected onActionComplete(): void {
    this.loadGroup();
  }
}
