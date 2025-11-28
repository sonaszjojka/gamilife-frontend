import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingListPeakComponent } from './ranking-list-peak.component';

describe('RankingListPeakComponent', () => {
  let component: RankingListPeakComponent;
  let fixture: ComponentFixture<RankingListPeakComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RankingListPeakComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RankingListPeakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
