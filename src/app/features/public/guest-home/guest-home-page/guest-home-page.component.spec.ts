import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestHomePageComponent } from './guest-home-page.component';

describe('GuestHomeComponent', () => {
  let component: GuestHomePageComponent;
  let fixture: ComponentFixture<GuestHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestHomePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GuestHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
