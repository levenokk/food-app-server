import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateDishInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  image: string;

  @Field(() => Float)
  price: number;

  @Field(() => String)
  composition: string;

  @Field(() => [Int])
  tag_ids: number[];

  @Field(() => [Int])
  filling_ids: number[];
}
