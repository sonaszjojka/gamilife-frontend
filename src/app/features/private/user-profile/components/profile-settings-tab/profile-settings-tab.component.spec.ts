import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSettingsTabComponent } from './profile-settings-tab.component';

describe('ProfileSettingsTabComponent', () => {
  let component: ProfileSettingsTabComponent;
  let fixture: ComponentFixture<ProfileSettingsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileSettingsTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileSettingsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
