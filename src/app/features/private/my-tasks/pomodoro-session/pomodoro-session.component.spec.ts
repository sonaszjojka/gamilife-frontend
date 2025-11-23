import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PomodoroSessionComponent } from './pomodoro-session.component';

describe('PomodoroSessionComponent', () => {
  let component: PomodoroSessionComponent;
  let fixture: ComponentFixture<PomodoroSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PomodoroSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PomodoroSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
