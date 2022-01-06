import { Module } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { DishesResolver } from './dishes.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dish } from './models/dish.model';
import { UsersModule } from '../users/users.module';
import { FillingsModule } from '../fillings/fillings.module';

@Module({
  imports: [SequelizeModule.forFeature([Dish]), UsersModule, FillingsModule],
  providers: [DishesService, DishesResolver],
  exports: [DishesService],
})
export class DishesModule {}
