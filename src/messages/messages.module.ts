import { Module } from '@nestjs/common';
import { MessagesResolver } from './messages.resolver';
import { MessagesService } from './messages.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './models';
import { OrdersModule } from '../orders/orders.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [OrdersModule, UsersModule, SequelizeModule.forFeature([Message])],
  providers: [MessagesResolver, MessagesService],
})
export class MessagesModule {}
