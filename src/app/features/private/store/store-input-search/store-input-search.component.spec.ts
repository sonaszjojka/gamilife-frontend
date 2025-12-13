import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { StoreInputSearchComponent } from './store-input-search.component';

describe('InputSearchComponent', () => {
  let component: StoreInputSearchComponent;
  let fixture: ComponentFixture<StoreInputSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreInputSearchComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreInputSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
