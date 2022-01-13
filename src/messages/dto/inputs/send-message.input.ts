import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class SendMessageInput {
  @Field(() => ID)
  order_id: number;

  @Field(() => String)
  message: string;
}
