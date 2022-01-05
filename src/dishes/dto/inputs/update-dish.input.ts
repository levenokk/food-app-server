import { Field, Float, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateDishInput {
  @Field(() => ID)
  id: number;

  @Field(() => String, {
    nullable: true,
  })
  name: string;

  @Field(() => String, {
    nullable: true,
  })
  image: string;

  @Field(() => Float, {
    nullable: true,
  })
  price: number;

  @Field(() => Float, {
    nullable: true,
  })
  stock_price: number;

  @Field(() => Date, {
    nullable: true,
  })
  stock_time: number;

  @Field(() => String, {
    nullable: true,
  })
  composition: string;

  @Field(() => [Int], {
    nullable: true,
    defaultValue: [],
  })
  tag_ids: number[];

  @Field(() => [Int], {
    nullable: true,
    defaultValue: [],
  })
  filling_ids: number[];
}
