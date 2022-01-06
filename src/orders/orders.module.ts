import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { DishOrder, FillingOrder, InstitutionOrder } from './models';

@Module({
  imports: [
    SequelizeModule.forFeature([InstitutionOrder, FillingOrder, DishOrder]),
  ],
  providers: [OrdersService, OrdersResolver],
})
export class OrdersModule {}
