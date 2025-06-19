import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiagnoseService } from './diagnose.service';
import { DiagnoseController } from './diagnose.controller';
import { Diagnose, DiagnoseSchema } from './entities/diagnose.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Diagnose.name, schema: DiagnoseSchema },
    ]),
  ],
  controllers: [DiagnoseController],
  providers: [DiagnoseService],
  exports: [DiagnoseService],
})
export class DiagnoseModule {}
