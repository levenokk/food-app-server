import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DishOrder, InstitutionOrder } from './models';
import { CreateOrderInput } from './dto/inputs';
import { DishesService } from '../dishes/dishes.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(InstitutionOrder)
    private institutionOrderModel: typeof InstitutionOrder,
    @InjectModel(DishOrder)
    private dishOrderModel: typeof DishOrder,
    private dishesService: DishesService,
  ) {}

  // todo: сделать так чтобы можно было сделать несколько блюд в заказе
  // todo: Сделать limit, offset
  public async getOrders() {
    return this.institutionOrderModel.findAll();
  }

  public async createOrder(data: CreateOrderInput) {
    const dish_ids = data.orders.map(({ dish_id }) => dish_id);
    const dishes = await this.dishesService.getDishesById(dish_ids);
    const institutions_ids = dishes.map(({ institution_id }) => institution_id);
  }
}
