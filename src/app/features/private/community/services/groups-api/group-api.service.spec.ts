import { TestBed } from '@angular/core/testing';

import { GroupApiService } from './group-api.service';

describe('GroupApiService', () => {
  let service: GroupApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
