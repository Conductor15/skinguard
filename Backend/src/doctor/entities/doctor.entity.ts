import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DoctorDocument = Doctor & Document;

@Schema({ timestamps: true })
export class Doctor {
  @Prop({ required: true, unique: true })
  doctor_id: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  discipline: string;

  @Prop({ type: Number, min: 1, max: 5 })
  rating: number;

  @Prop([{ type: Types.ObjectId, ref: 'ConsultList' }])
  consult_list_id: Types.ObjectId[];

  @Prop()
  avatar: string;

  @Prop({ required: true })
  permission: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);