import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullRankingComponent } from './full-ranking.component';

describe('FullRankingComponent', () => {
  let component: FullRankingComponent;
  let fixture: ComponentFixture<FullRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullRankingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FullRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
