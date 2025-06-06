import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsultService } from './consult.service';
import { ConsultController } from './consult.controller';
import { ConsultList, ConsultListSchema } from './entities/consult.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConsultList.name, schema: ConsultListSchema },
    ]),
  ],
  controllers: [ConsultController],
  providers: [ConsultService],
  exports: [ConsultService],
})
export class ConsultModule {}
