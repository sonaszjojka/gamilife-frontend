import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupActionsComponent } from './group-actions.component';

describe('GroupActionsComponent', () => {
  let component: GroupActionsComponent;
  let fixture: ComponentFixture<GroupActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
