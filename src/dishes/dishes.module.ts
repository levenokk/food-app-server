import { Module } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { DishesResolver } from './dishes.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from '../users/users.module';
import { FillingsModule } from '../fillings/fillings.module';
import { FavoriteDish, Dish, DishRating } from './models';
import { InstitutionsModule } from '../institutions/institutions.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Dish, FavoriteDish, DishRating]),
    UsersModule,
    FillingsModule,
    InstitutionsModule,
    UploadModule,
  ],
  providers: [DishesService, DishesResolver],
  exports: [DishesService],
})
export class DishesModule {}
