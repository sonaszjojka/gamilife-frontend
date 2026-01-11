import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupRankingPageComponent } from './group-ranking-page.component';

describe('GroupRankingPageComponent', () => {
  let component: GroupRankingPageComponent;
  let fixture: ComponentFixture<GroupRankingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupRankingPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupRankingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
