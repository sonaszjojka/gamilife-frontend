import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { GroupRequestsListComponent } from './group-requests-list.component';

describe('GroupRequestsListComponent', () => {
  let component: GroupRequestsListComponent;
  let fixture: ComponentFixture<GroupRequestsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupRequestsListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupRequestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
