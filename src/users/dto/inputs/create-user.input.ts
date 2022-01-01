import { Field, InputType } from '@nestjs/graphql';

@InputType({
  description: 'Input for create user',
})
export class CreateUserInput {
  @Field()
  name: string;

  @Field()
  phone_number: string;

  @Field(() => Boolean)
  is_partner: boolean;
}
