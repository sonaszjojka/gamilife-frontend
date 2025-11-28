import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTypeTagComponent } from './group-type-tag.component';

describe('GroupTypeTagComponent', () => {
  let component: GroupTypeTagComponent;
  let fixture: ComponentFixture<GroupTypeTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupTypeTagComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupTypeTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
