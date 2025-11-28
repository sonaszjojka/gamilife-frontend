import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserAccountButtonComponent } from './user-account-button.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAntIcons } from '@ant-design/icons-angular';
import { UserOutline } from '@ant-design/icons-angular/icons';

describe('UserAccountButtonComponent', () => {
  let component: UserAccountButtonComponent;
  let fixture: ComponentFixture<UserAccountButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAccountButtonComponent],
      providers: [provideHttpClient(), provideAntIcons([UserOutline])],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAccountButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
