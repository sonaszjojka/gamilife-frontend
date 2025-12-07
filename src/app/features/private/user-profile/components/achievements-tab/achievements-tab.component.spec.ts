import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementsTabComponent } from './achievements-tab.component';

describe('AchievementsTabComponent', () => {
  let component: AchievementsTabComponent;
  let fixture: ComponentFixture<AchievementsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementsTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AchievementsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
