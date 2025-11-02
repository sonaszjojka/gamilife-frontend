import { TestBed } from '@angular/core/testing';
import { OAuth2Service } from './oauth2.service';
describe('Oauth2Service', () => {
  let service: OAuth2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OAuth2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
