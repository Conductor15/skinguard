import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateOrderDetailDto {
  @IsString()
  @IsNotEmpty()
  order_detail_id: string;

  @IsString()
  @IsNotEmpty()
  orderID: string; // Order ID

  @IsString()
  @IsNotEmpty()
  productID: string; // Product ID

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  subtotal: number;
}
