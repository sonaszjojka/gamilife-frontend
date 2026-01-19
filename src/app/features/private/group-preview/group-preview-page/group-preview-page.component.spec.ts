import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupPreviewPageComponent } from './group-preview-page.component';

describe('PreviewGroupComponent', () => {
  let component: GroupPreviewPageComponent;
  let fixture: ComponentFixture<GroupPreviewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupPreviewPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupPreviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
