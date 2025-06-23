import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSkinLesionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  product_list_id: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
