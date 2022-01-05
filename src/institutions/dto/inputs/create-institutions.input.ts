import { Field, ID, InputType } from '@nestjs/graphql';
import { Day, PayMethod } from '../../models';

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

  @Field(() => [Day])
  work_days: Day[];

  @Field(() => [PayMethod])
  pay_methods: PayMethod[];

  @Field(() => [ID], {
    description: 'Tags ids',
  })
  tags: number[];
}
