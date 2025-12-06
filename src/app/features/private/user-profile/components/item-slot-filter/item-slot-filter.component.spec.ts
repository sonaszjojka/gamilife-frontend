import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSlotFilterComponent } from './item-slot-filter.component';

describe('ItemSlotFilterComponent', () => {
  let component: ItemSlotFilterComponent;
  let fixture: ComponentFixture<ItemSlotFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemSlotFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemSlotFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
