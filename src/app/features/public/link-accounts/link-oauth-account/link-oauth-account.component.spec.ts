import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkOAuthAccountComponent } from './link-oauth-account.component';

describe('LinkOAuthAccountComponent', () => {
  let component: LinkOAuthAccountComponent;
  let fixture: ComponentFixture<LinkOAuthAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkOAuthAccountComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkOAuthAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
