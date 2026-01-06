import { Component, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard-input-search',
  standalone: true,
  imports: [CommonModule, FormsModule, NzInputModule, NzIconModule],
  template: `
    <div class="input-search-container" [style.width]="width()">
      <nz-input-search>
        <input
          type="text"
          nz-input
          [value]="value()"
          (input)="onInputChange($event)"
          [placeholder]="placeholder()"
        />
      </nz-input-search>
      <ng-template #suffixIconSearch>
        <span nz-icon nzType="search"></span>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .input-search-container {
        display: flex;
        align-items: center;
      }

      nz-input-search {
        width: 100%;
        border-radius: var(--border-radius);
      }

      input {
        border-radius: var(--border-radius);
        background-color: #ffffff;
        border: 1px solid var(--border-color-base);
        color: #000000;
      }

      input::placeholder {
        color: rgba(0, 0, 0, 0.45);
      }
    `,
  ],
})
export class DashboardInputSearchComponent implements OnInit {
  placeholder = input<string>('Search...');
  width = input<string>('250px');

  readonly value = signal('');
  inputChange = output<string>();

  private readonly searchSubject = new Subject<string>();
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => {
        this.inputChange.emit(value);
      });
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value.set(input.value);
    this.searchSubject.next(input.value);
  }
}
