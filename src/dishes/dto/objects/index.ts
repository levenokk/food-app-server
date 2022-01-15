import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Dish } from '../../models';

@ObjectType()
export class DishesObject {
  @Field(() => Int)
  count: number;

  @Field(() => [Dish])
  rows: Dish[];
}
