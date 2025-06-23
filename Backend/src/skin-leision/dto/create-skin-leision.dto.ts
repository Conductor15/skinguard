import { IsString, IsNotEmpty, IsOptional, IsArray, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateSkinLesionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  symptoms?: string;

  @IsString()
  @IsOptional()
  recommendation?: string;

  @IsString()
  @IsOptional()
  dangerLevel?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageExamples?: string[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  relatedProducts?: Types.ObjectId[];
}
