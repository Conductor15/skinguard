import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
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

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Consult' }], default: [] })
  consult_list_id: Types.ObjectId[];
  @Prop()
  avatar: string;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ required: true })
  permission: string;

  @IsEmail()
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;
  @Prop()
  status: string;

  @Prop()
  previousStatus: string; // Lưu trữ status trước khi delete

  @Prop()
  experienceYears: number;

  @Prop()
  refreshToken: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
