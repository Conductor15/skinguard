import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiagnoseService } from './diagnose.service';
import { DiagnoseController } from './diagnose.controller';
import { DiagnoseList, DiagnoseListSchema } from './entities/diagnose.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DiagnoseList.name, schema: DiagnoseListSchema },
    ]),
  ],
  controllers: [DiagnoseController],
  providers: [DiagnoseService],
  exports: [DiagnoseService],
})
export class DiagnoseModule {}
