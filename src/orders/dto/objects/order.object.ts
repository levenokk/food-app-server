import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Order {
  @Field(() => Int)
  quality: number;

  @Field(() => Int)
  dish_id: number;

  @Field(() => Int)
  price: number;

  @Field(() => Int)
  stock_price: number;

  @Field(() => Boolean)
  stock: number;
}
