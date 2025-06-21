import { IsEmail, IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  doctor_id: string;

  @IsString()
  password: string;

  @IsString()
  fullName: string;

  @IsString()
  discipline: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  experienceYears?: number;
}