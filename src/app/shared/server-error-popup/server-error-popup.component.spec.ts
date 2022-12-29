import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerErrorPopupComponent } from './server-error-popup.component';

describe('ServerErrorPopupComponent', () => {
  let component: ServerErrorPopupComponent;
  let fixture: ComponentFixture<ServerErrorPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerErrorPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerErrorPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
