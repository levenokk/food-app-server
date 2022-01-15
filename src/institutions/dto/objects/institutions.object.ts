import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Institution } from '../../models';

@ObjectType()
export class InstitutionsObject {
  @Field(() => Int)
  count: number;

  @Field(() => [Institution])
  rows: Institution[];
}
