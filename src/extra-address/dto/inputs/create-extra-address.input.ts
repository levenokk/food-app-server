import { Field, InputType } from '@nestjs/graphql';

@InputType({
  description: 'Input for add extra address',
})
export class CreateExtraAddressInput {
  @Field(() => String)
  latitude: string;

  @Field(() => String)
  longitude: string;
}
