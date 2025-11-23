import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAdminActionsComponent } from './group-admin-actions.component';

describe('GroupAdminActionsComponent', () => {
  let component: GroupAdminActionsComponent;
  let fixture: ComponentFixture<GroupAdminActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupAdminActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupAdminActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
