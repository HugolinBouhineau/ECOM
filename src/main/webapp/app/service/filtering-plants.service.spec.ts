import { TestBed } from '@angular/core/testing';

import { FilteringPlantsService } from './filtering-plants.service';

describe('FilteringPlantsService', () => {
  let service: FilteringPlantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilteringPlantsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
