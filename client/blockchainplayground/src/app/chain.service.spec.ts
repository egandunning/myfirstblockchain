import { TestBed, inject } from '@angular/core/testing';

import { ChainService } from './chain.service';

describe('ChainService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChainService]
    });
  });

  it('should be created', inject([ChainService], (service: ChainService) => {
    expect(service).toBeTruthy();
  }));
});
