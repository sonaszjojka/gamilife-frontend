import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyActivitiesPageComponent } from './my-activities-page.component';

describe('TaskListComponent', () => {
  let component: MyActivitiesPageComponent;
  let fixture: ComponentFixture<MyActivitiesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyActivitiesPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyActivitiesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
