import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Dish } from './models/dish.model';
import { CreateDishInput, GetDishesInput, UpdateDishInput } from './dto/inputs';

@Injectable()
export class DishesService {
  constructor(@InjectModel(Dish) private dishModel: typeof Dish) {}

  public async getDishes({ search, offset, limit }: GetDishesInput) {
    return this.dishModel.findAll({
      offset,
      limit,
      where: {
        name: search,
      },
    });
  }

  public async getDish(pk: number) {
    return this.dishModel.findByPk(pk);
  }

  public async createDish(data: CreateDishInput) {
    return this.dishModel.create(data);
  }

  public async updateDish({ id, ...data }: UpdateDishInput) {
    const dish = await this.dishModel.findByPk(id);

    // todo: сделать првоерку по id

    if (!dish) {
      throw new NotFoundException();
    }

    await dish.update(data);

    return dish;
  }

  public async removeDish(pk: number) {
    const dish = await this.dishModel.findByPk(pk);

    // todo: сделать проверку по id

    if (!dish) {
      throw new NotFoundException();
    }

    await dish.destroy();

    return dish;
  }
}
