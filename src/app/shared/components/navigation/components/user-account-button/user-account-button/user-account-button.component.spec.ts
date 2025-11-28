import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountButtonComponent } from './user-account-button.component';

describe('UserAccountButtonComponent', () => {
  let component: UserAccountButtonComponent;
  let fixture: ComponentFixture<UserAccountButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAccountButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAccountButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
