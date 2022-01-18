import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AddInstitutionElevation {
  @Field(() => Int)
  evaluation: number;

  @Field(() => Int)
  institution_id: number;
}
