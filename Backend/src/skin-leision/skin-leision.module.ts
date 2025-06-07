import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SkinLesionService } from './skin-leision.service';
import { SkinLesionController } from './skin-leision.controller';
import { SkinLesion, SkinLesionSchema } from './entities/skin-leision.entity';
import { Product, ProductSchema } from '../product/entities/product.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SkinLesion.name, schema: SkinLesionSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [SkinLesionController],
  providers: [SkinLesionService],
  exports: [SkinLesionService],
})
export class SkinLesionModule {}
