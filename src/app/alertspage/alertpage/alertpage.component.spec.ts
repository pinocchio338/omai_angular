import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertpageComponent } from './alertpage.component';

describe('AlertpageComponent', () => {
  let component: AlertpageComponent;
  let fixture: ComponentFixture<AlertpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertpageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
