import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupRequestsPageComponent } from './group-requests-page.component';

describe('GroupRequestsPageComponent', () => {
  let component: GroupRequestsPageComponent;
  let fixture: ComponentFixture<GroupRequestsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupRequestsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupRequestsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
