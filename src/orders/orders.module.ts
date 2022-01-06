import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { DishOrder, FillingOrder, InstitutionOrder } from './models';
import { DishesModule } from '../dishes/dishes.module';

@Module({
  imports: [
    DishesModule,
    SequelizeModule.forFeature([InstitutionOrder, FillingOrder, DishOrder]),
  ],
  providers: [OrdersService, OrdersResolver],
})
export class OrdersModule {}
