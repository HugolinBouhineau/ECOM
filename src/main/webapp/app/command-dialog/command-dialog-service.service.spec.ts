import { TestBed } from '@angular/core/testing';

import { CommandDialogServiceService } from './command-dialog-service.service';

describe('CommandDialogServiceService', () => {
  let service: CommandDialogServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommandDialogServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
