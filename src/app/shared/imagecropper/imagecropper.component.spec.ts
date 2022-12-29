import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagecropperComponent } from './imagecropper.component';

describe('ImagecropperComponent', () => {
  let component: ImagecropperComponent;
  let fixture: ComponentFixture<ImagecropperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImagecropperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagecropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
