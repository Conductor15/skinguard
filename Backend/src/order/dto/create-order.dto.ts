import { IsString, IsNotEmpty, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  order_id: string;

  @IsString()
  @IsNotEmpty()
  orderBy: string; // Patient ID

  @IsDateString()
  @IsNotEmpty()
  orderDate: string;

  @IsOptional()
  @IsString()
  status?: string; // default: 'pending'

  @IsNumber()
  totalPay: number;

  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsOptional()
  @IsString()
  paymentStatus?: string; // default: 'pending'

  @IsOptional()
  @IsString()
  notes?: string;
}