import { TestBed } from '@angular/core/testing';

import { TransporteService } from './transporte.service';

describe('TransporteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransporteService = TestBed.get(TransporteService);
    expect(service).toBeTruthy();
  });
});
