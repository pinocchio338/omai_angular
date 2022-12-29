import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareDashboardsComponent } from './compare-dashboards.component';

describe('CompareDashboardsComponent', () => {
  let component: CompareDashboardsComponent;
  let fixture: ComponentFixture<CompareDashboardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompareDashboardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareDashboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
