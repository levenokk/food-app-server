import { Field, InputType } from '@nestjs/graphql';
import { Day, PayMethod } from '../../models';

@InputType()
export class UpdateInstitutionsInput {
  @Field(() => String, {
    nullable: true,
  })
  name: string;

  @Field(() => String, {
    nullable: true,
  })
  image: string;

  @Field(() => String, {
    nullable: true,
  })
  work_from: string;

  @Field(() => String, {
    nullable: true,
  })
  work_to: string;

  @Field(() => String, {
    nullable: true,
  })
  address: string;

  @Field(() => Number, {
    nullable: true,
  })
  shipping_cost: number;

  @Field(() => Number, {
    nullable: true,
  })
  free_delivery: number;

  @Field(() => [Number], {
    nullable: true,
    description: 'Tags ids',
  })
  tags: number[];

  @Field(() => [Day], {
    nullable: true,
    defaultValue: null,
  })
  work_days: Day[];

  @Field(() => [PayMethod], {
    nullable: true,
    defaultValue: null,
  })
  pay_methods: PayMethod[];
}
