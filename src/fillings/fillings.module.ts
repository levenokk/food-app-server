import { Module } from '@nestjs/common';
import { FillingsService } from './fillings.service';
import { FillingsResolver } from './fillings.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Filling, DishFilling } from './models/';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, SequelizeModule.forFeature([Filling, DishFilling])],
  providers: [FillingsService, FillingsResolver],
  exports: [FillingsService],
})
export class FillingsModule {}
