import { ComponentFixture, TestBed } from '@angular/core/testing';

import { D3ComponentComponent } from './d3-component.component';

describe('D3ComponentComponent', () => {
  let component: D3ComponentComponent;
  let fixture: ComponentFixture<D3ComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ D3ComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(D3ComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
