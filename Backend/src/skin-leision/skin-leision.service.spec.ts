import { Test, TestingModule } from '@nestjs/testing';
import { SkinLeisionService } from './skin-leision.service';

describe('SkinLeisionService', () => {
  let service: SkinLeisionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkinLeisionService],
    }).compile();

    service = module.get<SkinLeisionService>(SkinLeisionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
