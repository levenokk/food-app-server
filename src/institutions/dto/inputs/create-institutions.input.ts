import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateInstitutionsInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  image: string;

  @Field(() => String)
  work_from: string;

  @Field(() => String)
  work_to: string;

  @Field(() => String)
  address: string;

  @Field(() => Number)
  shipping_cost: number;

  @Field(() => Number)
  free_delivery: number;
}
