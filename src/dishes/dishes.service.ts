import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Dish } from './models';
import {
  CreateDishInput,
  GetDishesInput,
  StockTime,
  UpdateDishInput,
} from './dto/inputs';
import { UsersService } from '../users/users.service';
import {
  Institution,
  InstitutionPayMethod,
  WorkDay,
} from '../institutions/models';
import { Tag } from '../tags/models';
import { Filling } from '../fillings/models';
import { FillingsService } from '../fillings/fillings.service';
import { Sequelize } from 'sequelize-typescript';
import * as moment from 'moment';

@Injectable()
export class DishesService {
  constructor(
    @InjectModel(Dish) private dishModel: typeof Dish,
    private usersService: UsersService,
    private fillingsService: FillingsService,
  ) {}

  public async getDishesById(ids: number[]) {
    return this.dishModel.findAll({
      where: Sequelize.or({
        id: ids,
      }),
      include: [Filling],
    });
  }

  public async getDishes({ search, offset, limit }: GetDishesInput) {
    const options: any = { offset, limit };

    if (search) {
      options.where = {
        name: search,
      };
    }

    return this.dishModel.findAll({
      ...options,
      include: [
        {
          model: Institution,
          include: [WorkDay, Dish, Tag, InstitutionPayMethod, Filling, Tag],
        },
        Tag,
        Filling,
      ],
    });
  }

  public async getDish(pk: number) {
    return this.dishModel.findByPk(pk, {
      include: [
        {
          model: Institution,
          include: [WorkDay, Dish, Tag, InstitutionPayMethod, Filling, Tag],
        },
        Tag,
        Filling,
      ],
    });
  }

  public async createDish({
    user_id,
    tag_ids,
    filling_ids,
    ...data
  }: CreateDishInput & { user_id: number }) {
    const user = await this.usersService.finUserById(user_id);

    if (!user.is_partner) {
      throw new BadGatewayException();
    }

    const fillings = await this.fillingsService.getFillingsById(filling_ids);
    const isInstitutionsFilling = fillings.every(
      (filling) => filling.institution_id === user.institution.id,
    );

    if (!isInstitutionsFilling) {
      throw new BadRequestException(
        'All filling must to be belong own institution',
      );
    }

    const dish = await this.dishModel.create({
      ...data,
      institution_id: user.institution.id,
    });

    await dish.$set('tags', tag_ids);

    return dish.reload();
  }

  public async updateDish({
    id,
    user_id,
    filling_ids,
    stock_time,
    ...data
  }: UpdateDishInput & { user_id: number }) {
    const user = await this.usersService.finUserById(user_id);

    if (!user.is_partner) {
      throw new BadGatewayException();
    }

    const dish = await this.dishModel.findByPk(id, {
      include: [
        {
          model: Institution,
          include: [WorkDay, Dish, Tag, InstitutionPayMethod, Filling, Tag],
        },
        Tag,
        Filling,
      ],
    });

    if (!dish) {
      throw new NotFoundException();
    }

    if (dish.institution.user_id !== user_id) {
      throw new BadGatewayException();
    }

    if (filling_ids.length) {
      const fillings = await this.fillingsService.getFillingsById(filling_ids);
      const isInstitutionsFilling = fillings.every(
        (filling) => filling.institution_id === user.institution.id,
      );

      if (!isInstitutionsFilling) {
        throw new BadRequestException(
          'All filling must to be belong own institution',
        );
      }

      await dish.$set('fillings', filling_ids);
    }

    let time = null;

    if (stock_time) {
      switch (stock_time) {
        case StockTime.ONE_DAY:
          time = moment().add(1, 'day');
          break;
        case StockTime.ONE_WEEK:
          time = moment().add(1, 'week');
          break;
        case StockTime.TWO_WEEKS:
          time = moment().add(1, 'weeks');
          break;
        case StockTime.ONE_MOUTH:
          time = moment().add(1, 'month');
          break;
        default:
          time = moment();
          break;
      }

      time = time.valueOf();
    }

    await dish.update({ ...data, stock_time: time });

    return dish.reload();
  }

  public async removeDish(pk: number, user_id: number) {
    const dish = await this.dishModel.findByPk(pk, {
      include: [
        {
          model: Institution,
          include: [WorkDay, Dish, Tag, InstitutionPayMethod, Filling, Tag],
        },
        Tag,
        Filling,
      ],
    });

    if (!dish) {
      throw new NotFoundException();
    }

    if (dish.institution.user_id !== user_id) {
      throw new BadGatewayException();
    }

    await dish.destroy();

    return dish;
  }

  public async addDishToFavorite(dish_id: number, user_id: number) {
    const dish = await this.dishModel.findByPk(dish_id);
    const user = await this.usersService.finUserById(user_id);

    if (!dish) {
      throw new NotFoundException();
    }

    if (user.is_partner) {
      throw new BadGatewayException();
    }

    try {
      await user.$add('favorite_dishes', dish_id);
    } catch {
      throw new BadGatewayException();
    }

    return true;
  }

  public async removeFavoriteDish(dish_id: number, user_id: number) {
    const dish = await this.dishModel.findByPk(dish_id);
    const user = await this.usersService.finUserById(user_id);

    if (!dish) {
      throw new NotFoundException();
    }

    if (user.is_partner) {
      throw new BadGatewayException();
    }

    await user.$remove('favorite_dishes', dish_id);

    return true;
  }

  // todo: добавить лимит и тд
  public async getFavoriteDishes(user_id: number) {
    const user = await this.usersService.finUserById(user_id);

    if (user.is_partner) {
      throw new BadGatewayException();
    }

    return user.favorite_dishes;
  }
}
