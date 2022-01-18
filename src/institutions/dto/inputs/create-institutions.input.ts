import { Field, Float, ID, InputType } from '@nestjs/graphql';
import { Day, PayMethod } from '../../models';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@InputType()
export class CreateInstitutionsInput {
  @Field(() => String)
  name: string;

  @Field(() => GraphQLUpload)
  image: FileUpload;

  @Field(() => String)
  work_from: string;

  @Field(() => String)
  work_to: string;

  @Field(() => String)
  address: string;

  @Field(() => Float)
  shipping_cost: number;

  @Field(() => Float)
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
