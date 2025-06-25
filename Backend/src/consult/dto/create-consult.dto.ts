import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateConsultDto {
  @IsString()
  @IsNotEmpty()
  consult_id: string;
  @IsDateString()
  @IsNotEmpty()
  // date: Date;
  date: string;

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