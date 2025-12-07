import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileContentComponent } from './user-profile-content.component';

describe('UserProfileContentComponent', () => {
  let component: UserProfileContentComponent;
  let fixture: ComponentFixture<UserProfileContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
