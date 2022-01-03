import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetDishesInput {
  @Field(() => Number, {
    defaultValue: 0,
    nullable: true,
  })
  offset: number;

  @Field(() => Number, {
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
