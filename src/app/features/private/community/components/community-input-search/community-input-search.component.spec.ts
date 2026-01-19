import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CommunityInputSearchComponent } from './community-input-search.component';

describe('InputSearchComponent', () => {
  let component: CommunityInputSearchComponent;
  let fixture: ComponentFixture<CommunityInputSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityInputSearchComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunityInputSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
