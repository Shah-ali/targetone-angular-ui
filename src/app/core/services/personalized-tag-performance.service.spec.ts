import { TestBed } from '@angular/core/testing';

import { PersonalizedTagPerformanceService } from './personalized-tag-performance.service';

describe('PersonalizedTagPerformanceService', () => {
  let service: PersonalizedTagPerformanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalizedTagPerformanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
