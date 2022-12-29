import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewshiftComponent } from './newshift.component';

describe('NewshiftComponent', () => {
  let component: NewshiftComponent;
  let fixture: ComponentFixture<NewshiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewshiftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewshiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
