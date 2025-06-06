import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConsultListDocument = ConsultList & Document;

@Schema({ timestamps: true })
export class ConsultList {
  @Prop({ required: true, unique: true })
  consult_id: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patient_id: Types.ObjectId;

  @Prop({ required: true })
  patient_description: string;

  @Prop({ required: true })
  result: string;
}

export const ConsultListSchema = SchemaFactory.createForClass(ConsultList);