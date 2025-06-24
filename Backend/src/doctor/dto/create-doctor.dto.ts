import {
  IsEmail,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsEnum,
  IsBoolean,
} from 'class-validator';

export enum DoctorStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  AVAILABLE = 'Available',
  BUSY = 'Busy',
  SUSPENDED = 'Suspended',
}

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
  @IsEnum(DoctorStatus)
  status?: DoctorStatus;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;

  @IsOptional()
  @IsNumber()
  experienceYears?: number;
}
