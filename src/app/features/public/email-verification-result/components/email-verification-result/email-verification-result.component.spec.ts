import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerificationResultComponent } from './email-verification-result.component';

describe('EmailVerificationResultComponent', () => {
  let component: EmailVerificationResultComponent;
  let fixture: ComponentFixture<EmailVerificationResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailVerificationResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailVerificationResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
