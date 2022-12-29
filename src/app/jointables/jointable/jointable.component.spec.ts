import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JointableComponent } from './jointable.component';

describe('JointableComponent', () => {
  let component: JointableComponent;
  let fixture: ComponentFixture<JointableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JointableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JointableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
