import { IsEmail, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  patient_id: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString()
  password: string;

  @IsString()
  fullName: string;

  @IsDateString({}, { message: 'Birth day must be a valid date' })
  birthDay: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  orderID?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString({ each: true })
  diagnose_id_list?: string[];
}
