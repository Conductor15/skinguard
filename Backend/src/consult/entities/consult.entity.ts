// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';

// export type ConsultDocument = Consult & Document;

// @Schema({ timestamps: true })
// export class Consult {
//   @Prop({ required: true, unique: true })
//   consult_id: string;

//   @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
//   doctorID: Types.ObjectId; 

//   @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
//   patientID: Types.ObjectId; 

//   @Prop({ required: true })
//   scheduledTime: Date; 

//   @Prop({ default: 'scheduled' })
//   status: string; 

//   @Prop({ required: true })
//   consultMethod: string;

//   @Prop()
//   notes: string; 

//   @Prop()
//   meetingLink: string; 

//   @Prop()
//   feedback: string;

//   // @Prop({ default: Date.now })
//   // updatedAt: Date;

//   // @Prop({ default: Date.now })
//   // createdAt: Date;

//   @Prop({ default: false })
//   deleted: boolean; 
// }

// export const ConsultSchema = SchemaFactory.createForClass(Consult);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConsultDocument = Consult & Document;

@Schema({ timestamps: true })
export class Consult {
  @Prop({ required: true, unique: true })
  consult_id: string;

  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctor_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patient_id: Types.ObjectId;

  @Prop({ required: true })
  // date: Date;
  date: string;

  @Prop()
  patient_description: string;

  @Prop()
  result: string;
}

export const ConsultSchema = SchemaFactory.createForClass(Consult);