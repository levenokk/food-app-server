import { Field, InputType } from '@nestjs/graphql';
import { Order } from '../objects';
import { InstitutionOrderPayMethods } from '../../models';

@InputType()
export class CreateOrderInput {
  @Field(() => [Order])
  orders: [Order];

  @Field(() => String)
  latitude: string;

  @Field(() => String)
  longitude: string;

  @Field(() => InstitutionOrderPayMethods)
  pay_method: InstitutionOrderPayMethods;
}
