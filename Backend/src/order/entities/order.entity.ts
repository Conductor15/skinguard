import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  order_id: string;

  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  orderBy: Types.ObjectId; // FK to Patient

  @Prop({ required: true })
  orderDate: Date; // Đổi từ 'date' thành 'orderDate'

  @Prop({ required: true, default: 'pending' })
  status: string; // pending, confirmed, shipped, delivered, cancelled

  @Prop({ required: true })
  totalPay: number; // Tổng tiền

  @Prop({ required: true })
  shippingAddress: string; // Địa chỉ giao hàng

  @Prop({ required: true })
  paymentMethod: string; // COD, Card, Bank Transfer

  @Prop({ required: true, default: 'pending' })
  paymentStatus: string; // pending, paid, failed, refunded
  @Prop()
  notes: string; // Ghi chú

  @Prop()
  deleted: boolean; // Soft delete flag
}

export const OrderSchema = SchemaFactory.createForClass(Order);