import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseruploadComponent } from './userupload.component';

describe('UseruploadComponent', () => {
  let component: UseruploadComponent;
  let fixture: ComponentFixture<UseruploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UseruploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseruploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
