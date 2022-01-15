import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserPay, User } from './models';

@Module({
  imports: [SequelizeModule.forFeature([User, UserPay])],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
