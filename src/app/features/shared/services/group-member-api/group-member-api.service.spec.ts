import { TestBed } from '@angular/core/testing';

import { GroupMemberApiService } from './group-member-api.service';

describe('GroupMemberApiService', () => {
  let service: GroupMemberApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupMemberApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
