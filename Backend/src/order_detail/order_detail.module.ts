import { Module } from '@nestjs/common';
import { OrderDetailService } from './order_detail.service';
import { OrderDetailController } from './order_detail.controller';

@Module({
  controllers: [OrderDetailController],
  providers: [OrderDetailService]
})
export class OrderDetailModule {}
