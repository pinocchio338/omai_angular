import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WellsComponent } from './wells.component';

describe('WellsComponent', () => {
  let component: WellsComponent;
  let fixture: ComponentFixture<WellsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WellsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WellsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
