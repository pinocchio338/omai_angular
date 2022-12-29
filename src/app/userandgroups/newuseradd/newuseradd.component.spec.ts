import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewuseraddComponent } from './newuseradd.component';

describe('NewuseraddComponent', () => {
  let component: NewuseraddComponent;
  let fixture: ComponentFixture<NewuseraddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewuseraddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewuseraddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
