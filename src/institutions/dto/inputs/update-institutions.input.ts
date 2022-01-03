import { Field, InputType } from '@nestjs/graphql';

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
}
