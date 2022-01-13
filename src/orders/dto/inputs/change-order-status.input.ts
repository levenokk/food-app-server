import { Field, ID, InputType } from '@nestjs/graphql';
import { Status } from '../../models';

@InputType()
export class ChangeOrderStatusInput {
  @Field(() => ID)
  order_id: number;

  @Field(() => Status, {
    nullable: true,
  })
  status: Status;
}
