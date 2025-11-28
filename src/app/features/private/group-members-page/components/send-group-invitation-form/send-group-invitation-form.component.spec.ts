import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendGroupInvitationFormComponent } from './send-group-invitation-form.component';

describe('SendGroupInvitationFormComponent', () => {
  let component: SendGroupInvitationFormComponent;
  let fixture: ComponentFixture<SendGroupInvitationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendGroupInvitationFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SendGroupInvitationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
