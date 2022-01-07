import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class Order {
  @Field(() => Int)
  quality: number;

  @Field(() => Int)
  dish_id: number;

  @Field(() => [Int])
  filling_ids: number[];
}
