// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { ConsultService } from './consult.service';
// import { ConsultController } from './consult.controller';
// import { Consult, ConsultSchema } from './entities/consult.entity';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Consult.name, schema: ConsultSchema }]),
//   ],
//   controllers: [ConsultController],
//   providers: [ConsultService],
//   exports: [ConsultService],
// })
// export class ConsultModule {}
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsultService } from './consult.service';
import { ConsultController } from './consult.controller';
import { Consult, ConsultSchema } from './entities/consult.entity';
import { DoctorModule } from '../doctor/doctor.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Consult.name, schema: ConsultSchema }]),
    DoctorModule, // Đảm bảo import DoctorModule để inject Doctor model
  ],
  controllers: [ConsultController],
  providers: [ConsultService],
  exports: [ConsultService],
})
export class ConsultModule {}