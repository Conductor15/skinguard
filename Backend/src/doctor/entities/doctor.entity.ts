// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';

// export type DoctorDocument = Doctor & Document;

// @Schema({ timestamps: true })
// export class Doctor {
//   @Prop({ required: true, unique: true })
//   doctor_id: string;

//   @Prop({ required: true })
//   password: string;
//   @Prop({ required: true })
//   fullName: string;

//   @Prop({ required: true })
//   specialty: string;

//   @Prop()
//   bio: string;

//   @Prop({ required: true })
//   phone: string;

//   @Prop()
//   avatar: string;

//   @Prop({ type: Number, min: 1, max: 5 })
//   rating: number;

//   @Prop({ required: true, unique: true })
//   email: string;

//   @Prop()
//   token: string;

//   @Prop({ default: 'active' })
//   status: string;

//   @Prop()
//   deletedAt: Date;

//   @Prop()
//   experienceYears: number;

//   @Prop({ default: false })
//   deleted: boolean;
// }

// export const DoctorSchema = SchemaFactory.createForClass(Doctor);
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

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Consult' }], default: [] })
  consult_list_id: Types.ObjectId[];

  @Prop()
  avatar: string;

  @Prop()
  permission: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;              

  @Prop()
  status: string;

  @Prop()
  experienceYears: number;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);