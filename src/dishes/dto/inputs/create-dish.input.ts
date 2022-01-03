import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class CreateDishInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  image: string;

  @Field(() => Float)
  price: number;

  @Field(() => Float)
  stock_price: number;

  @Field(() => Date)
  stock_time: number;

  @Field(() => String)
  composition: string;
}
