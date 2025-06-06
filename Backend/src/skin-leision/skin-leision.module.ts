import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SkinLesionService } from './skin-leision.service';
import { SkinLesionController } from './skin-leision.controller';
import { SkinLesion, SkinLesionSchema } from './entities/skin-leision.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SkinLesion.name, schema: SkinLesionSchema },
    ]),
  ],
  controllers: [SkinLesionController],
  providers: [SkinLesionService],
  exports: [SkinLesionService],
})
export class SkinLesionModule {}
