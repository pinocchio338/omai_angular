import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitesCardComponent } from './sites-card.component';

describe('SitesCardComponent', () => {
  let component: SitesCardComponent;
  let fixture: ComponentFixture<SitesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SitesCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SitesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
