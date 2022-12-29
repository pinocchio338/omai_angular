import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedClientComponent } from './selected-client.component';

describe('SelectedClientComponent', () => {
  let component: SelectedClientComponent;
  let fixture: ComponentFixture<SelectedClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
