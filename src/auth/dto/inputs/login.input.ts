import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field(() => String)
  phone: string;

  @Field(() => Number)
  code: number;

  @Field(() => Boolean)
  is_partner: boolean;
}
