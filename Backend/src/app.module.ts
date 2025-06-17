import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { UserController } from './user/user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
// import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PatientModule } from './patient/patient.module';
import { DoctorModule } from './doctor/doctor.module';
import { DiagnoseModule } from './diagnose/diagnose.module';
import { OrderModule } from './order/order.module';
import { SkinLesionModule } from './skin-leision/skin-leision.module';
import { ConsultModule } from './consult/consult.module';
import { ProductModule } from './product/product.module';
@Module({
  imports: [
    // MongooseModule.forRoot(
    //   'mongodb+srv://duc:eVMRWdKda7M3dtrA@cluster0.onp11.mongodb.net/',
    // ),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PatientModule,
    DoctorModule,
    DiagnoseModule,
    OrderModule,
    ProductModule,
    ConsultModule,
    SkinLesionModule,
  ],  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
