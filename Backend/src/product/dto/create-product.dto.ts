export class CreateProductDto {
  product_id: string;
  title: string;
  description: string;
  price: number;
  sold_count?: number;
  availability?: boolean;
  image?: string;
}