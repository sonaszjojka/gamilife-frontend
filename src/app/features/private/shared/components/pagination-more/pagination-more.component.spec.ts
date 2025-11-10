import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationMoreComponent } from './pagination-more.component';

describe('PaginationMoreComponent', () => {
  let component: PaginationMoreComponent;
  let fixture: ComponentFixture<PaginationMoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationMoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginationMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
