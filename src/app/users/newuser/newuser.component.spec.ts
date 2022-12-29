import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewuserComponent } from './newuser.component';

describe('NewuserComponent', () => {
  let component: NewuserComponent;
  let fixture: ComponentFixture<NewuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewuserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
