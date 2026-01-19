import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PomodoroSessionPageComponent } from './pomodoro-session-page.component';

describe('PomodoroSessionComponent', () => {
  let component: PomodoroSessionPageComponent;
  let fixture: ComponentFixture<PomodoroSessionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PomodoroSessionPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PomodoroSessionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
