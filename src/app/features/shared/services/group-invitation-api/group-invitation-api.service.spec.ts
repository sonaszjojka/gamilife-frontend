import { TestBed } from '@angular/core/testing';

import { GroupInvitationApiService } from './group-invitation-api.service';

describe('GroupInvitationApiService', () => {
  let service: GroupInvitationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupInvitationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
