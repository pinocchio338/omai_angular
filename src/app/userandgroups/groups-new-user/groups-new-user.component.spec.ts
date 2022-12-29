import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsNewUserComponent } from './groups-new-user.component';

describe('GroupsNewUserComponent', () => {
  let component: GroupsNewUserComponent;
  let fixture: ComponentFixture<GroupsNewUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupsNewUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsNewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
