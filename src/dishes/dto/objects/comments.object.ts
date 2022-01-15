import { Field, Int, ObjectType } from '@nestjs/graphql';
import { DishRating } from '../../models';

@ObjectType()
export class CommentsObject {
  @Field(() => Int)
  count: number;

  @Field(() => Int)
  avarage_rating: number;

  @Field(() => [DishRating])
  rows: DishRating[];
}
