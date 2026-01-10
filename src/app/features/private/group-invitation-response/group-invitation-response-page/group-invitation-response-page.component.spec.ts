import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupInvitationResponsePageComponent } from './group-invitation-response-page.component';

describe('GroupInvitationResponseComponent', () => {
  let component: GroupInvitationResponsePageComponent;
  let fixture: ComponentFixture<GroupInvitationResponsePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupInvitationResponsePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupInvitationResponsePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
