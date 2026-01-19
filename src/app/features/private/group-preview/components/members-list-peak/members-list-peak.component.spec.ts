import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersListPeakComponent } from './members-list-peak.component';

describe('MembersListPeakComponent', () => {
  let component: MembersListPeakComponent;
  let fixture: ComponentFixture<MembersListPeakComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersListPeakComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MembersListPeakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
