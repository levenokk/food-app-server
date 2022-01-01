import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SendCodeInput {
  @Field(() => String)
  phone: string;

  @Field(() => Boolean, {
    defaultValue: false,
  })
  is_partner: boolean;
}
