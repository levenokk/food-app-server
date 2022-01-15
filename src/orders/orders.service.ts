import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DishOrder, InstitutionOrder, Status } from './models';
import {
  ChangeOrderStatusInput,
  CreateOrderInput,
  GetOrdersInput,
} from './dto/inputs';
import { DishesService } from '../dishes/dishes.service';
import { Dish } from '../dishes/models';
import { Order } from './dto/objects';
import { InstitutionsService } from '../institutions/institutions.service';
import { Institution } from '../institutions/models';
import { UsersService } from '../users/users.service';
import { User } from '../users/models';
import * as moment from 'moment';

//todo: сделать рефактор кода, тут можно сократить

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(InstitutionOrder)
    private institutionOrderModel: typeof InstitutionOrder,
    @InjectModel(DishOrder)
    private dishOrderModel: typeof DishOrder,
    private dishesService: DishesService,
    private institutionsService: InstitutionsService,
    private usersService: UsersService,
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

  private async createDishOrder(
    institutions_ids: number[],
    dishes: Dish[],
    institutions: Institution[],
    data: CreateOrderInput & { user_id: number },
  ) {
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

            if (moment().valueOf() < moment(dish.stock_time).valueOf()) {
              price += dish.stock_price * quality;
            } else {
              price += dish.price * quality;
            }

            price += dish.fillings
              .filter(({ id }) => filling_ids.includes(id))
              .reduce((a, b) => a + Number(b.price), 0);

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
          pay_method: data.pay_method,
        });

        const dishOrders = institutionDishes.map(
          ({ dish_id, quality, filling_ids }) => {
            const dish = dishes.find(({ id }) => id === dish_id);
            let price = 0;

            if (moment().valueOf() < moment(dish.stock_time).valueOf()) {
              price += dish.stock_price * quality;
            } else {
              price += dish.price * quality;
            }

            price += dish.fillings
              .filter(({ id }) => filling_ids.includes(id))
              .reduce((a, b) => a + Number(b.price), 0);

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
          .bulkCreate(dishOrders)
          .then((createdDishOrders) => {
            createdDishOrders.forEach(async (order, index) => {
              await order.$set('fillings', dishOrders[index].fillings);
            });
          });
      }),
    );
  }

  public async getOrders({
    user_id,
    ...data
  }: GetOrdersInput & { user_id: number }) {
    const user = await this.usersService.finUserById(user_id);

    if (user.is_partner) {
      const institution = await this.institutionsService.getInstitutionByUserId(
        user_id,
      );

      return this.institutionOrderModel.findAll({
        where: {
          institution_id: institution.id,
        },
        ...data,
        include: [User, DishOrder],
      });
    }

    return this.institutionOrderModel.findAll({
      where: {
        user_id,
      },
      ...data,
      include: [User, DishOrder],
    });
  }

  public async createOrder(data: CreateOrderInput & { user_id: number }) {
    const user = await this.usersService.finUserById(data.user_id);

    if (user.is_partner) {
      throw new ForbiddenException('Partner can not create order');
    }

    const dish_ids = Array.from(
      new Set(data.orders.map(({ dish_id }) => dish_id)),
    );
    const dishes = await this.dishesService.getDishesById(dish_ids);

    if (dish_ids.length !== dishes.length) {
      throw new BadRequestException('One of dishes not found');
    }

    const institutions_ids = Array.from(
      new Set(dishes.map(({ institution_id }) => institution_id)),
    );
    const institutions = await this.institutionsService.getInstitutionsById(
      institutions_ids,
    );

    this.checkOrder(dishes, data.orders);

    await this.createDishOrder(institutions_ids, dishes, institutions, data);

    return true;
  }

  public async changeOrderStatus({
    user_id,
    ...data
  }: ChangeOrderStatusInput & { user_id: number }) {
    const user = await this.usersService.finUserById(user_id);
    const institution = await this.institutionsService.getInstitutionByUserId(
      user_id,
    );

    if (!user.is_partner) {
      return new ForbiddenException('User can not change order status');
    }
    const order = await this.institutionOrderModel.findByPk(data.order_id);

    if (order.institution_id !== institution.id) {
      return new ForbiddenException('You can change only your orders');
    }

    order.status = data.status;

    await order.save();

    return true;
  }

  public async getOrderById(id: number) {
    return this.institutionOrderModel.findByPk(id, {
      include: [User],
    });
  }
}
