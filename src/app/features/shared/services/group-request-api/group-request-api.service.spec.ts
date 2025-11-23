import { TestBed } from '@angular/core/testing';

import { GroupRequestApiService } from './group-request-api.service';

describe('GroupRequestApiService', () => {
  let service: GroupRequestApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupRequestApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
