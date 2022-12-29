import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentNamePopupComponent } from './component-name-popup.component';

describe('ComponentNamePopupComponent', () => {
  let component: ComponentNamePopupComponent;
  let fixture: ComponentFixture<ComponentNamePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponentNamePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentNamePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
