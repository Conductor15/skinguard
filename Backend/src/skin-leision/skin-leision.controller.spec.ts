import { Test, TestingModule } from '@nestjs/testing';
import { SkinLeisionController } from './skin-leision.controller';
import { SkinLeisionService } from './skin-leision.service';

describe('SkinLeisionController', () => {
  let controller: SkinLeisionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkinLeisionController],
      providers: [SkinLeisionService],
    }).compile();

    controller = module.get<SkinLeisionController>(SkinLeisionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
