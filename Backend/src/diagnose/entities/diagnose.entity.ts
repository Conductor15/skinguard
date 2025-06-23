// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// export type DiagnoseDocument = Diagnose & Document;

// @Schema({ timestamps: true })
// export class Diagnose {
//   @Prop({ required: true, unique: true })
//   diagnose_id: string;

//   @Prop({ required: true })
//   prediction: string;

//   @Prop()
//   image: string;

//   @Prop()
//   description: string;

//   @Prop({ type: Number })
//   confidence: number;

//   @Prop({ default: false })
//   deleted: boolean;

//   // @Prop({ default: Date.now })
//   // createdAt: Date;

//   @Prop()
//   createdBy: string;
// }

// export const DiagnoseSchema = SchemaFactory.createForClass(Diagnose);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DiagnoseDocument = Diagnose & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class Diagnose {
  @Prop({ required: true, unique: true })
  diagnose_id: string;

  @Prop({ required: true })
  prediction: string;

  @Prop()
  image: string;

  @Prop()
  description: string;

  @Prop()
  confidence: number;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ required: true })
  createdBy: string; // patient_id
}

export const DiagnoseSchema = SchemaFactory.createForClass(Diagnose);