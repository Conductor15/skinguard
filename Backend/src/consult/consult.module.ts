import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsultService } from './consult.service';
import { ConsultController } from './consult.controller';
import { Consult, ConsultSchema } from './entities/consult.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Consult.name, schema: ConsultSchema }]),
  ],
  controllers: [ConsultController],
  providers: [ConsultService],
  exports: [ConsultService],
})
export class ConsultModule {}
