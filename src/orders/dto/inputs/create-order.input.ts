import { Field, InputType } from "@nestjs/graphql";
import { Order } from '../objects';

@InputType()
export class CreateOrderInput {
  @Field(() => [Order])
  orders: [Order];

  @Field(() => String)
  latitude: string;

  @Field(() => String)
  longitude: string;
}
