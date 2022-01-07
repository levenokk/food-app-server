import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrderInput } from './dto/inputs';
import { CurrentUser } from '../auth/decorators/currentUser';
import { User } from '../users/models/user.model';

@Resolver()
export class OrdersResolver {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  public async createOrder(
    @CurrentUser() user: User,
    @Args('data') data: CreateOrderInput,
  ) {
    return this.ordersService.createOrder({ ...data, user_id: user.id });
  }
}
