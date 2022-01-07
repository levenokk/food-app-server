import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DishOrder, InstitutionOrder, Status } from './models';
import { CreateOrderInput } from './dto/inputs';
import { DishesService } from '../dishes/dishes.service';
import { Dish } from '../dishes/models/dish.model';
import { Order } from './dto/objects';
import { InstitutionsService } from '../institutions/institutions.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(InstitutionOrder)
    private institutionOrderModel: typeof InstitutionOrder,
    @InjectModel(DishOrder)
    private dishOrderModel: typeof DishOrder,
    private dishesService: DishesService,
    private institutionsService: InstitutionsService,
  ) {}

  private checkOrder(dishes: Dish[], orders: Order[]) {
    for (const dish of dishes) {
      const orderFillingsForDish = Array.from(
        new Set(
          orders
            .filter(({ dish_id }) => dish_id === dish.id)
            .map(({ filling_ids }) => filling_ids)
            .flat(),
        ),
      );
      const fillings = dish.fillings.map(({ id }) => id);
      const isDishFillings = orderFillingsForDish.every((filling) =>
        fillings.includes(filling),
      );

      if (!isDishFillings) {
        throw new BadRequestException(
          'Filling can not must to be from different dish',
        );
      }
    }
  }

  // todo: Сделать limit, offset
  public async getOrders() {
    return this.institutionOrderModel.findAll();
  }

  public async createOrder(data: CreateOrderInput & { user_id: number }) {
    const dish_ids = data.orders.map(({ dish_id }) => dish_id);
    const dishes = await this.dishesService.getDishesById(dish_ids);

    // if (dish_ids.length !== dishes.length) {
    //   throw new BadRequestException('One of dishes not found');
    // }

    const institutions_ids = Array.from(
      new Set(dishes.map(({ institution_id }) => institution_id)),
    );
    const institutions = await this.institutionsService.getInstitutionsById(
      institutions_ids,
    );

    // console.log(institutions_ids);

    this.checkOrder(dishes, data.orders);

    await Promise.all(
      institutions_ids.map(async (institution_id) => {
        const institutionDishes = data.orders.filter(({ dish_id }) => {
          const dish = dishes.find(({ id }) => id === dish_id);

          return dish.institution_id === institution_id;
        });
        const cost = institutionDishes
          .map(({ dish_id, quality, filling_ids }) => {
            let price = 0;
            const dish = dishes.find(({ id }) => id === dish_id);

            price +=
              (dish.stock_price ? dish.stock_price : dish.price) * quality;
            price += dish.fillings
              .filter(({ id }) => filling_ids.includes(id))
              .reduce((a, b) => a + b.price, 0);

            return price;
          })
          .reduce((a, b) => a + b, 0);

        const shipping_cost = institutions.find(
          ({ id }) => id === institution_id,
        ).shipping_cost;
        let delivery = shipping_cost;

        if (cost >= shipping_cost) {
          delivery = 0;
        }

        const order = await this.institutionOrderModel.create({
          user_id: data.user_id,
          institution_id,
          delivery,
          rating: 0,
          longitude: data.longitude,
          status: Status.NEW,
          latitude: data.latitude,
          cost,
        });

        const dishOrders = institutionDishes.map(
          ({ dish_id, quality, filling_ids }) => {
            const dish = dishes.find(({ id }) => id === dish_id);
            let price = 0;

            price +=
              (dish.stock_price ? dish.stock_price : dish.price) * quality;
            price += dish.fillings
              .filter(({ id }) => filling_ids.includes(id))
              .reduce((a, b) => a + b.price, 0);

            return {
              dish_id,
              quality,
              fillings: filling_ids,
              institution_order_id: order.id,
              user_id: data.user_id,
              price,
            };
          },
        );

        await this.dishOrderModel
          .bulkCreate(dishOrders, {})
          .then((createdDishOrders) => {
            createdDishOrders.forEach(async (order, index) => {
              await order.$set('fillings', dishOrders[index].fillings);
            });
          });
      }),
    );

    return true;
  }
}
