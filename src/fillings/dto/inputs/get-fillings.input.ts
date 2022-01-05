import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class GetFillingsInput {
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

  @Field(() => ID)
  id: string;
}
