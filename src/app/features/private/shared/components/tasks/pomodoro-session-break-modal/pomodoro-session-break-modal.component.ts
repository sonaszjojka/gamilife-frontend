import {Component, EventEmitter, Output} from '@angular/core';
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
      (nzOnCancel)="handleCancel()">

      <ng-container *nzModalContent>
        <p>{{ modalMessage }}</p>
      </ng-container>
    </nz-modal>

    <ng-template #modalFooter>
      @if (isBreakEndModal) {
        <button nz-button nzType="default" (click)="handleEndSession()">
          Zakończ sesję
        </button>

        <button nz-button nzType="primary" (click)="handleContinue()">
          Kontynuuj następną sesję
        </button>
      } @else {
        <button nz-button nzType="primary" (click)="handleOk()">
          OK
        </button>
      }
    </ng-template>

  `
})
export class PomodoroSessionBreakModalComponent {
  @Output() continueSession = new EventEmitter<void>();
  @Output() endSession = new EventEmitter<void>();

  isVisible = false;
  isBreakEndModal = false;
  modalTitle = '';
  modalMessage = '';

  showBreakStartModal(): void {
    this.isBreakEndModal = false;
    this.modalTitle = 'Start Your Break!';
    this.modalMessage = 'Rozpoczyna się 5-minutowa przerwa. Odpocznij i wróć za chwilę!';
    this.isVisible = true;
    this.playNote(400)
  }

  showBreakEndModal(): void {
    this.isBreakEndModal = true;
    this.modalTitle = 'Przerwa zakończona!';
    this.modalMessage = 'Twoja przerwa dobiegła końca. Czy chcesz kontynuować kolejną sesję?';
    this.isVisible = true;
    this.playNote(300)
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
