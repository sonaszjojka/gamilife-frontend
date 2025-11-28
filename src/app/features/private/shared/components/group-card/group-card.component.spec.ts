import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupCardComponent } from './group-card.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAntIcons } from '@ant-design/icons-angular';
import { TeamOutline } from '@ant-design/icons-angular/icons';

describe('GroupCardComponent', () => {
  let component: GroupCardComponent;
  let fixture: ComponentFixture<GroupCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupCardComponent],
      providers: [provideHttpClient(), provideAntIcons([TeamOutline])],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupCardComponent);
    component = fixture.componentInstance;

    component.group = {
      groupId: '1',
      groupName: 'Test Group',
      adminId: 'admin1',
      groupCurrencySymbol: '$',
      joinCode: 'ABC123',
      membersLimit: 10,
      groupType: { title: 'Open' },
      membersCount: 5,
      isMember: true,
      hasActiveGroupRequest: false,
      loggedUserMembershipDto: null,
      membersSortedDescByTotalEarnedMoney: [],
      adminUsername: 'adminUser',
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
