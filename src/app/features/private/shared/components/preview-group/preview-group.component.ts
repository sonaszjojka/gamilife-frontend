import { Component, inject, OnInit, signal } from '@angular/core';
import { Group } from '../../../../shared/models/group.model';
import { GroupApiService } from '../../../../shared/services/groups-api/group-api.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { GroupTypeTagComponent } from '../group-type-tag/group-type-tag.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-preview-group',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzCardModule,
    NzIconModule,
    NzSpinModule,
    NzTagModule,
    GroupTypeTagComponent,
  ],
  templateUrl: './preview-group.component.html',
  styleUrls: ['./preview-group.component.css'],
})
export class PreviewGroupComponent implements OnInit {
  protected group = signal<Group | undefined>(undefined);
  protected groupId = signal<string | undefined>(undefined);
  protected loading = signal<boolean>(true);

  protected buttonText = signal<string>('Join Group');
  protected buttonDisabled = signal<boolean>(true);

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
          this.updateButtonState();
          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.loading.set(false);
        },
      });
  }

  protected updateButtonState(): void {
    const g = this.group();
    if (!g) {
      this.buttonText.set('Join Group');
      this.buttonDisabled.set(true);
      return;
    }

    if (g.membersLimit && g.membersCount >= g.membersLimit) {
      this.buttonText.set('Group full');
      this.buttonDisabled.set(true);
      return;
    }

    if (g.isMember) {
      this.buttonText.set('You are a member');
      this.buttonDisabled.set(true);
      return;
    }

    if (g.hasActiveGroupRequest) {
      this.buttonText.set('Request sent');
      this.buttonDisabled.set(true);
      return;
    }

    if (g.groupType.title === 'Request only') {
      this.buttonText.set('Send request');
      this.buttonDisabled.set(false);
      return;
    }

    if (g.groupType.title === 'Closed') {
      this.buttonText.set('Invitation only');
      this.buttonDisabled.set(true);
      return;
    }

    this.buttonText.set('Join group');
    this.buttonDisabled.set(false);
  }

  onButtonClick(): void {
    const g = this.group();
    const id = this.groupId();
    if (!g || !id) return;

    this.loading.set(true);
    this.buttonDisabled.set(true);

    if (g.groupType.title === 'Open') {
      this.groupApi
        .joinGroup(id)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.loadGroup();
          },
          error: (err) => {
            console.error(err);
            this.loading.set(false);
            this.updateButtonState();
          },
        });
    } else {
      this.groupApi
        .sendRequest(id)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.loadGroup();
          },
          error: (err) => {
            console.error(err);
            this.loading.set(false);
            this.updateButtonState();
          },
        });
    }
  }
}
