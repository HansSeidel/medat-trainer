import { TestBed } from '@angular/core/testing';

import { FeatureBranchService } from './feature-branch.service';

describe('FeatureBranchService', () => {
  let service: FeatureBranchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeatureBranchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
