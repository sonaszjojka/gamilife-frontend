import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerificationResultPageComponent } from './email-verification-result-page.component';

describe('EmailVerificationResultComponent', () => {
  let component: EmailVerificationResultPageComponent;
  let fixture: ComponentFixture<EmailVerificationResultPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailVerificationResultPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailVerificationResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
