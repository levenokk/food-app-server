import { Module } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { DishesResolver } from './dishes.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from '../users/users.module';
import { FillingsModule } from '../fillings/fillings.module';
import { FavoriteDish, Dish } from './models';

@Module({
  imports: [
    SequelizeModule.forFeature([Dish, FavoriteDish]),
    UsersModule,
    FillingsModule,
  ],
  providers: [DishesService, DishesResolver],
  exports: [DishesService],
})
export class DishesModule {}
