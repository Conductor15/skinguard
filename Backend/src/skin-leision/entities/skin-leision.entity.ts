import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SkinLesionDocument = SkinLesion & Document;

@Schema({ timestamps: true })
export class SkinLesion {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  product_list_id: string;

  @Prop({ required: true })
  description: string;
}

export const SkinLesionSchema = SchemaFactory.createForClass(SkinLesion);
