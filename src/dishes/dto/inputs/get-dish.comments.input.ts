import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetDishCommentsInput {
  @Field(() => ID)
  dish_id: number;

  @Field(() => Int, {
    nullable: true,
    defaultValue: 10,
  })
  limit: number;

  @Field(() => Int, {
    nullable: true,
    defaultValue: 0,
  })
  offset: number;
}
