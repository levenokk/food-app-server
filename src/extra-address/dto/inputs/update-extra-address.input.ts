import { Field, ID, InputType } from '@nestjs/graphql';

@InputType({
  description: 'Input for add extra address',
})
export class UpdateExtraAddressInput {
  @Field(() => String)
  latitude: string;

  @Field(() => String)
  longitude: string;

  @Field(() => ID)
  id: number;
}
