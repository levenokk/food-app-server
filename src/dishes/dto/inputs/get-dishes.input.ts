import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetDishesInput {
  @Field(() => Int, {
    defaultValue: 0,
    nullable: true,
  })
  offset: number;

  @Field(() => Int, {
    defaultValue: 10,
    nullable: true,
  })
  limit: number;

  @Field(() => String, {
    defaultValue: '',
    nullable: true,
  })
  search: string;
}
