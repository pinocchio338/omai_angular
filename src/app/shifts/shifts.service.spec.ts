import { TestBed } from '@angular/core/testing';

import { ShiftsService } from './shifts.service';

describe('ShiftsService', () => {
  let service: ShiftsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
