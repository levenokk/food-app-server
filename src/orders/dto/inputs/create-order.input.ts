import { Field } from '@nestjs/graphql';
import { Order } from '../objects';

export class CreateOrderInput {
  @Field(() => [Order])
  orders: [Order];
}
