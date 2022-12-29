import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RcaComponent } from './rca.component';

describe('RcaComponent', () => {
  let component: RcaComponent;
  let fixture: ComponentFixture<RcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RcaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
