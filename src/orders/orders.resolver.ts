import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChangeOrderStatusInput, CreateOrderInput } from "./dto/inputs";
import { CurrentUser } from '../auth/decorators/currentUser';
import { User } from '../users/models/user.model';
import { InstitutionOrder } from './models';

@Resolver()
export class OrdersResolver {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [InstitutionOrder])
  public async getOrders(@CurrentUser() user: User) {
    return this.ordersService.getOrders(user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  public async createOrder(
    @CurrentUser() user: User,
    @Args('data') data: CreateOrderInput,
  ) {
    return this.ordersService.createOrder({ ...data, user_id: user.id });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  public async changeOrderStatus(
    @CurrentUser() user: User,
    @Args('data') data: ChangeOrderStatusInput,
  ) {
    return this.ordersService.changeOrderStatus({ ...data, user_id: user.id });
  }
}
