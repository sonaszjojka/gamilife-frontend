import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestHomeComponent } from './guest-home.component';

describe('GuestHomeComponent', () => {
  let component: GuestHomeComponent;
  let fixture: ComponentFixture<GuestHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
