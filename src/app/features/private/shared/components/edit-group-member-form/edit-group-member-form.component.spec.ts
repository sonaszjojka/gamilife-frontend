import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGroupMemberFormComponent } from './edit-group-member-form.component';

describe('EditGroupMemberFormComponent', () => {
  let component: EditGroupMemberFormComponent;
  let fixture: ComponentFixture<EditGroupMemberFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditGroupMemberFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditGroupMemberFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
