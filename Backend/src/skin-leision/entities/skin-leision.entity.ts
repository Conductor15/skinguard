import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SkinLesionDocument = SkinLesion & Document;

@Schema({ timestamps: true })
export class SkinLesion {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  symptoms: string;

  @Prop()
  recommendation: string;

  @Prop()
  dangerLevel: string;

  @Prop([String])
  imageExamples: string[];
  @Prop([{ type: Types.ObjectId, ref: 'Product' }])
  relatedProducts: Types.ObjectId[];

  @Prop({ default: false })
  deleted: boolean;
}

export const SkinLesionSchema = SchemaFactory.createForClass(SkinLesion);
