export class OrderItemDto {
  readonly productId: string;
  readonly quantity: number;
}

export class CreateOrderDto {
  readonly userId: string;
  readonly shippingAddress: string;
  readonly items: OrderItemDto[];
}