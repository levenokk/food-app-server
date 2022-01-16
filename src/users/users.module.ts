import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserPay, User } from './models';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [SequelizeModule.forFeature([User, UserPay]), UploadModule],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
