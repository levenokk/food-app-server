import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AddDishCommentsInput {
  @Field(() => ID)
  dish_id: number;

  @Field(() => String)
  message: string;

  @Field(() => Int)
  stars: number;
}
