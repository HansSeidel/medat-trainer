import { TestBed } from '@angular/core/testing';

import { AlgZahlenfolgenService } from './algZahlenfolgen.service';

describe('AlgZahlenfolgenService', () => {
  let service: AlgZahlenfolgenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlgZahlenfolgenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
