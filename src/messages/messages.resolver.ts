import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { Message } from './models';
import { MessagesService } from './messages.service';
import { CurrentUser } from '../auth/decorators/currentUser';
import { User } from '../users/models/user.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PubSub } from 'graphql-subscriptions';
import { SendMessageInput } from './dto/inputs';
import { UsersService } from '../users/users.service';
import { OrdersService } from '../orders/orders.service';
import { InstitutionsService } from '../institutions/institutions.service';

const pubSub = new PubSub();

@Resolver()
export class MessagesResolver {
  constructor(
    private messagesService: MessagesService,
    private usersService: UsersService,
    private ordersService: OrdersService,
    private institutionsService: InstitutionsService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Message], {
    defaultValue: [],
    nullable: true,
  })
  public async getOrderDialog(
    @Args('id', {
      type: () => ID,
    })
    id: number,
    @CurrentUser() user: User,
  ) {
    return this.messagesService.getOrderChat(id, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Message)
  public async sendMessage(
    @CurrentUser() user: User,
    @Args('data') data: SendMessageInput,
  ) {
    const message = await this.messagesService.sendMessage({
      ...data,
      user_id: user.id,
    });

    pubSub.publish('message', {
      Message: message,
    });

    return message;
  }

  @Subscription(() => Message, {
    resolve: ({ Message }) => {
      return Message;
    },
    async filter(this: MessagesResolver, { Message }, variables, context) {
      if (context?.user_id) {
        const user = await this.usersService.finUserById(context.user_id);
        const institution =
          await this.institutionsService.getInstitutionByUserId(
            context.user_id,
          );
        const institution_order = await this.ordersService.getOrderById(
          Message.institution_order_id,
        );

        return (
          user.id === institution_order.user_id ||
          institution_order.institution_id === institution.id
        );
      }

      return false;
    },
  })
  async messageSent() {
    return pubSub.asyncIterator('message');
  }
}
