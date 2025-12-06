import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarCustomizationTabComponent } from './avatar-customization-tab.component';

describe('AvatarCustomizationTabComponent', () => {
  let component: AvatarCustomizationTabComponent;
  let fixture: ComponentFixture<AvatarCustomizationTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarCustomizationTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarCustomizationTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
