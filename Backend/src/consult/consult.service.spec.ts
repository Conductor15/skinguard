import { Test, TestingModule } from '@nestjs/testing';
import { ConsultService } from './consult.service';

describe('ConsultService', () => {
  let service: ConsultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsultService],
    }).compile();

    service = module.get<ConsultService>(ConsultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
