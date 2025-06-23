import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateDiagnoseDto {
  @IsString()
  @IsNotEmpty()
  diagnose_id: string;

  @IsString()
  @IsNotEmpty()
  prediction: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  confidence?: number;

  @IsString()
  @IsNotEmpty()
  createdBy: string; // patient_id
}