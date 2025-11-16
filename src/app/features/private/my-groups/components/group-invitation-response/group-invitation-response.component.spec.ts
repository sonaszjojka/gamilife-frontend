import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupInvitationResponseComponent } from './group-invitation-response.component';

describe('GroupInvitationResponseComponent', () => {
  let component: GroupInvitationResponseComponent;
  let fixture: ComponentFixture<GroupInvitationResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupInvitationResponseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupInvitationResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
