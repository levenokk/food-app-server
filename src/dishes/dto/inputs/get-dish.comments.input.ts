import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class GetDishCommentsInput {
  @Field(() => ID)
  dish_id: number;
}
