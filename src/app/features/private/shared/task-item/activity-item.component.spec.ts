import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityItemComponent } from './activity-item.component';

describe('TaskItemComponent', () => {
  let component: ActivityItemComponent;
  let fixture: ComponentFixture<ActivityItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
