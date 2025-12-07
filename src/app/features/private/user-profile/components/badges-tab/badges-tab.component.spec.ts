import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgesTabComponent } from './badges-tab.component';

describe('BadgesTabComponent', () => {
  let component: BadgesTabComponent;
  let fixture: ComponentFixture<BadgesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgesTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BadgesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
