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

const pubSub = new PubSub();

@Resolver()
export class MessagesResolver {
  constructor(private messagesService: MessagesService) {}

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
    filter(payload, variables, user: User) {
      return true;
    },
  })
  async messageSent() {
    return pubSub.asyncIterator('message');
  }
}
