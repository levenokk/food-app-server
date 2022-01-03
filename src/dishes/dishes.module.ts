import { Module } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { DishesResolver } from './dishes.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dish } from './models/dish.model';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([Dish]), UsersModule],
  providers: [DishesService, DishesResolver],
})
export class DishesModule {}
