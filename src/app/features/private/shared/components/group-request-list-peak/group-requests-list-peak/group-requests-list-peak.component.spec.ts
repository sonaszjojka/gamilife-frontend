import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupRequestsListPeakComponent } from './group-requests-list-peak.component';

describe('GroupRequestsListPeakComponent', () => {
  let component: GroupRequestsListPeakComponent;
  let fixture: ComponentFixture<GroupRequestsListPeakComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupRequestsListPeakComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupRequestsListPeakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
