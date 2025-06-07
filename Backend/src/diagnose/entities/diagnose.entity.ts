import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DiagnoseListDocument = DiagnoseList & Document;

@Schema({ timestamps: true })
export class DiagnoseList {  @Prop({ required: true, unique: true })
  diagnose_list_id: string;
  
  @Prop({ type: Types.ObjectId, ref: 'SkinLesion', required: true })
  lesion_type: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop()
  image: string;

  @Prop({ type: Number, min: 0, max: 100 })
  accuracy: number;

  @Prop({ type: Number, min: 1, max: 5 })
  rating: number;
}

export const DiagnoseListSchema = SchemaFactory.createForClass(DiagnoseList);
