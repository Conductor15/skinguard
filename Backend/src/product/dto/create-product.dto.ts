// export class CreateProductDto {
//   product_id: string;
//   title: string;
//   description: string;
//   price: number;
//   sold_count?: number;
//   availability?: boolean;
//   image?: string;
// }
import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  product_id: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  sold_count?: number;

  @IsOptional()
  @IsBoolean()
  availability?: boolean;

  @IsOptional()
  @IsString()
  image?: string;
}