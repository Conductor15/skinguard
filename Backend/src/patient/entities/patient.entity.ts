import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PatientDocument = Patient & Document;

@Schema({ timestamps: true })
export class Patient {
  @Prop({ required: true, unique: true })
  patient_id: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  birthDay: Date;

  @Prop()
  phone: string;

  @Prop()
  avatar: string;

  @Prop()
  orderID: string;

  @Prop()
  token: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop({ default: false })
  deleted: boolean;

  @Prop()
  deletedAt: Date;

  @Prop({ type: [String], default: [] })//
  diagnose_id_list: string[];//
}

export const PatientSchema = SchemaFactory.createForClass(Patient);