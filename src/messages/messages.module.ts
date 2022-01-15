import { Module } from '@nestjs/common';
import { MessagesResolver } from './messages.resolver';
import { MessagesService } from './messages.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './models';
import { OrdersModule } from '../orders/orders.module';
import { UsersModule } from '../users/users.module';
import { InstitutionsModule } from '../institutions/institutions.module';

@Module({
  imports: [
    OrdersModule,
    UsersModule,
    InstitutionsModule,
    SequelizeModule.forFeature([Message]),
  ],
  providers: [MessagesResolver, MessagesService],
})
export class MessagesModule {}
