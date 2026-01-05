import {Component, output} from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-pomdoro-break-modal',
  imports: [NzButtonModule, NzModalModule],
  standalone: true,
  template: `
    <nz-modal
      [(nzVisible)]="isVisible"
      [nzTitle]="modalTitle"
      [nzClosable]="isBreakEndModal"
      [nzFooter]="modalFooter"
      (nzOnCancel)="handleCancel()"
    >
      <ng-container *nzModalContent>
        <p>{{ modalMessage }}</p>
      </ng-container>
    </nz-modal>

    <ng-template #modalFooter>
      @if (isBreakEndModal) {
        <button nz-button nzType="default" (click)="handleEndSession()">
          End Session
        </button>

        <button nz-button nzType="primary" (click)="handleContinue()">
          Continue
        </button>
      } @else {
        <button nz-button nzType="primary" (click)="handleOk()">OK</button>
      }
    </ng-template>
  `,
})
export class PomodoroSessionBreakModalComponent {
  continueSession = output<void>();
   endSession = output<void>();

  isVisible = false;
  isBreakEndModal = false;
  modalTitle = '';
  modalMessage = '';

  showBreakStartModal(): void {
    this.isBreakEndModal = false;
    this.modalTitle = 'Start Your Break!';
    this.modalMessage =
      'Starting 5 minute break. Have a good rest and come back';
    this.isVisible = true;
    this.playNote(400);
  }

  showBreakEndModal(): void {
    this.isBreakEndModal = true;
    this.modalTitle = 'Your Break Has Ended';
    this.modalMessage =
      'Your break has ended. Do You want to start another session?';
    this.isVisible = true;
    this.playNote(300);
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    if (this.isBreakEndModal) {
      this.handleEndSession();
    } else {
      this.isVisible = false;
    }
  }

  handleContinue(): void {
    this.isVisible = false;
    this.continueSession.emit();
  }

  handleEndSession(): void {
    this.isVisible = false;
    this.endSession.emit();
  }

  playNote(frequency: number, duration = 1000) {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.value = frequency;
    osc.type = 'sine';

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  }
}
