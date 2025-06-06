import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SkinLesionDocument = SkinLesion & Document;

@Schema({ timestamps: true })
export class SkinLesion {
  @Prop({ required: true, unique: true })
  leision_type: string;

  @Prop([{ type: Types.ObjectId, ref: 'Product' }])
  product_id_list: Types.ObjectId[];

  @Prop({ required: true })
  description: string;
}

export const SkinLesionSchema = SchemaFactory.createForClass(SkinLesion);
