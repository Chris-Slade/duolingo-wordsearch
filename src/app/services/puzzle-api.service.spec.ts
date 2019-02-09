import { TestBed } from '@angular/core/testing';

import { PuzzleApiService } from './puzzle-api.service';

describe('PuzzleApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PuzzleApiService = TestBed.get(PuzzleApiService);
    expect(service).toBeTruthy();
  });
});
