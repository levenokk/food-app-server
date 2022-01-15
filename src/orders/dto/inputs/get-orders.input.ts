import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetOrdersInput {
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
