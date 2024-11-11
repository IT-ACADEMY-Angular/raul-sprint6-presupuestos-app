import { TestBed } from '@angular/core/testing';

import { BudgetService } from '../app/services/budget.service';

describe('BudgetService', () => {
  let service: BudgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
