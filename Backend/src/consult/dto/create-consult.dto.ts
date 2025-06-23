import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateConsultDto {
  @IsString()
  @IsNotEmpty()
  consult_id: string;
  @IsString()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  doctor_id: string;    // ObjectId string

  @IsString()
  @IsNotEmpty()
  patient_id: string;   // ObjectId string

  @IsString()
  @IsNotEmpty()
  patient_description: string;

  @IsString()
  @IsNotEmpty()
  result: string;
}