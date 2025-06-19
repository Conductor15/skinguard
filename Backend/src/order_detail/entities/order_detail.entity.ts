import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDetailDocument = OrderDetail & Document;

@Schema({ timestamps: true })
export class OrderDetail {
  @Prop({ required: true, unique: true })
  order_detail_id: string; // PK

  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  orderID: Types.ObjectId; // FK to Order

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productID: Types.ObjectId; // FK to Product

  @Prop({ required: true, min: 1 })
  quantity: number; // Số lượng

  @Prop({ required: true, min: 0 })
  price: number; // Giá tại thời điểm mua

  @Prop({ required: true, min: 0 })
  subtotal: number; // quantity * price

  @Prop({ default: false })
  deleted: boolean; // Soft delete flag
}

export const OrderDetailSchema = SchemaFactory.createForClass(OrderDetail);
