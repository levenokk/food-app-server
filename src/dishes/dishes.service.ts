import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Dish } from './models/dish.model';
import { CreateDishInput, GetDishesInput, UpdateDishInput } from './dto/inputs';
import { UsersService } from '../users/users.service';
import {
  Institution,
  InstitutionPayMethod,
  WorkDay,
} from '../institutions/models';
import { Tag } from '../tags/models';
import { Filling } from '../fillings/models/filling.model';

@Injectable()
export class DishesService {
  constructor(
    @InjectModel(Dish) private dishModel: typeof Dish,
    private usersService: UsersService,
  ) {}

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
      ],
    });
  }

  public async createDish({
    user_id,
    tag_ids,
    ...data
  }: CreateDishInput & { user_id: number }) {
    const user = await this.usersService.finUserById(user_id);

    if (!user.is_partner) {
      throw new BadGatewayException();
    }

    const dish = await this.dishModel.create({
      ...data,
      institution_id: user.institution.id,
    });

    await dish.$set('tags', tag_ids);

    return dish;
  }

  public async updateDish({
    id,
    user_id,
    ...data
  }: UpdateDishInput & { user_id: number }) {
    const dish = await this.dishModel.findByPk(id, {
      include: [Institution],
    });

    if (!dish) {
      throw new NotFoundException();
    }

    if (dish.institution.user_id !== user_id) {
      throw new BadGatewayException();
    }

    await dish.update(data);

    return dish;
  }

  public async removeDish(pk: number, user_id: number) {
    const dish = await this.dishModel.findByPk(pk, {
      include: [Institution],
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
}
