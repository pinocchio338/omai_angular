import { TestBed } from '@angular/core/testing';

import { WellsService } from './wells.service';

describe('WellsService', () => {
  let service: WellsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WellsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
