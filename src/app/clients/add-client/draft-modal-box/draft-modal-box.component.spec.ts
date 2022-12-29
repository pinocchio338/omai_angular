import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftModalBoxComponent } from './draft-modal-box.component';

describe('DraftModalBoxComponent', () => {
  let component: DraftModalBoxComponent;
  let fixture: ComponentFixture<DraftModalBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DraftModalBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftModalBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
