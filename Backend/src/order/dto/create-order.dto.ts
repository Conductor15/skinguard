export class CreateOrderDto {
  order_id: string;
  date: Date;
  product_id: string;
  quantity: number;
  paymentMethod: string;
}