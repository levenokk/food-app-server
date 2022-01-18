import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { Day, PayMethod } from '../../models';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@InputType()
export class UpdateInstitutionsInput {
  @Field(() => String, {
    nullable: true,
  })
  name: string;

  @Field(() => GraphQLUpload, {
    nullable: true,
  })
  image: FileUpload;

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

  @Field(() => Float, {
    nullable: true,
  })
  shipping_cost: number;

  @Field(() => Float, {
    nullable: true,
  })
  free_delivery: number;

  @Field(() => [Int], {
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
