import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class CreateFillingInput {
  @Field(() => String)
  name: string;
  @Field(() => Float)
  price: number;
  @Field(() => Float)
  weight: number;

  @Field(() => String)
  image: string;
}
