// import { Module, forwardRef } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { DoctorService } from './doctor.service';
// import { DoctorController } from './doctor.controller';
// import { Doctor, DoctorSchema } from './entities/doctor.entity';
// import { AuthModule } from '../auth/auth.module';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
//     forwardRef(() => AuthModule), // Import AuthModule để sử dụng AuthService
//   ],
//   controllers: [DoctorController],
//   providers: [DoctorService],
//   exports: [DoctorService],
// })
// export class DoctorModule {}
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { Doctor, DoctorSchema } from './entities/doctor.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
    forwardRef(() => AuthModule),
  ],
  controllers: [DoctorController],
  providers: [DoctorService],
  exports: [
    DoctorService,
    MongooseModule, // Export để ConsultModule dùng được DoctorModel
  ],
})
export class DoctorModule {}