import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { DishOrder, FillingOrder, InstitutionOrder } from './models';
import { DishesModule } from '../dishes/dishes.module';
import { InstitutionsModule } from '../institutions/institutions.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    DishesModule,
    InstitutionsModule,
    SequelizeModule.forFeature([InstitutionOrder, FillingOrder, DishOrder]),
  ],
  providers: [OrdersService, OrdersResolver],
  exports: [OrdersService],
})
export class OrdersModule {}
