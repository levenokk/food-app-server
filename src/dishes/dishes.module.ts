import { Module } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { DishesResolver } from './dishes.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dish } from './models/dish.model';

@Module({
  imports: [SequelizeModule.forFeature([Dish])],
  providers: [DishesService, DishesResolver],
})
export class DishesModule {}
