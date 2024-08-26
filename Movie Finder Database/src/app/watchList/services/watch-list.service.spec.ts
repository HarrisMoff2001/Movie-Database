import { TestBed } from '@angular/core/testing';

import { WatchListsService } from './watch-list.service';

describe('WatchListsService', () => {
  let service: WatchListsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WatchListsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
