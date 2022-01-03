import { Field, InputType } from '@nestjs/graphql';
import { Day } from '../../models';

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

  @Field(() => [Day], {
    description: 'MONDAY TUESDAY WEDNESDAY THURSDAY FRIDAY SATURDAY SUNDAY',
  })
  work_days: Array<
    | 'MONDAY'
    | 'TUESDAY'
    | 'WEDNESDAY'
    | 'THURSDAY'
    | 'FRIDAY'
    | 'SATURDAY'
    | 'SUNDAY'
  >;
}
