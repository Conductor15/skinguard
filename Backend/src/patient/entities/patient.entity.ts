import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PatientDocument = Patient & Document;

@Schema({ timestamps: true })
export class Patient {
  @Prop({ required: true, unique: true })
  patient_id: string;

  @Prop([{ type: Types.ObjectId, ref: 'DiagnoseList' }])
  diagnose_id_list: Types.ObjectId[];

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: Date.now })
  created_time: Date;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  birthDay: Date;

  @Prop()
  avatar: string;

  @Prop()
  orderID: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);