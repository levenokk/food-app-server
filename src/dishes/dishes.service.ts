import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Dish, DishRating } from './models';
import {
  AddDishCommentsInput,
  CreateDishInput,
  GetDishCommentsInput,
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
import { InstitutionsService } from '../institutions/institutions.service';
import { Op } from 'sequelize';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class DishesService {
  constructor(
    @InjectModel(Dish) private dishModel: typeof Dish,
    @InjectModel(DishRating) private dishRatingModel: typeof DishRating,
    private usersService: UsersService,
    private fillingsService: FillingsService,
    private institutionsService: InstitutionsService,
    private uploadService: UploadService,
  ) {}

  public async getDishesById(ids: number[]) {
    return this.dishModel.findAll({
      where: Sequelize.or({
        id: ids,
      }),
      include: [Filling],
    });
  }

  public async getDishes({ search, ...data }: GetDishesInput) {
    const options: any = data;

    if (search) {
      options.where = {
        [Op.and]: [
          {
            name: {
              [Op.iLike]: `%${search}%`,
            },
          },
        ],
      };
    }

    return this.dishModel.findAndCountAll({
      ...options,
      include: [
        {
          model: Institution,
          include: [WorkDay, Dish, Tag, InstitutionPayMethod, Filling, Tag],
        },
        Tag,
        Filling,
      ],
      distinct: true,
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
    image,
    ...data
  }: CreateDishInput & { user_id: number }) {
    const user = await this.usersService.finUserById(user_id);
    const institution = await this.institutionsService.getInstitutionByUserId(
      user_id,
    );

    if (!user.is_partner) {
      throw new ForbiddenException();
    }

    const fillings = await this.fillingsService.getFillingsById(filling_ids);
    const isInstitutionsFilling = fillings.every(
      (filling) => filling.institution_id === institution.id,
    );

    if (!isInstitutionsFilling) {
      throw new BadRequestException(
        'All filling must to be belong own institution',
      );
    }

    const image_url = await this.uploadService.uploadFile(await image);

    const dish = await this.dishModel.create({
      ...data,
      institution_id: institution.id,
      image: image_url,
    });

    await dish.$set('tags', tag_ids);

    return dish.reload();
  }

  public async updateDish({
    id,
    user_id,
    filling_ids,
    stock_time,
    image,
    ...data
  }: UpdateDishInput & { user_id: number }) {
    const user = await this.usersService.finUserById(user_id);
    const institution = await this.institutionsService.getInstitutionByUserId(
      user_id,
    );

    if (!user.is_partner) {
      throw new ForbiddenException();
    }

    const dish = await this.dishModel.findByPk(id, {
      include: [
        Institution,
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
      throw new ForbiddenException();
    }

    if (filling_ids.length) {
      const fillings = await this.fillingsService.getFillingsById(filling_ids);
      const isInstitutionsFilling = fillings.every(
        (filling) => filling.institution_id === institution.id,
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

    let image_url = dish.image;

    if (image) {
      image_url = await this.uploadService.uploadFile(await image);

      await this.uploadService.removeFile(user.image);
    }

    await dish.update({ ...data, stock_time: time, image: image_url });

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
      throw new ForbiddenException();
    }

    await this.uploadService.removeFile(dish.image);
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
      throw new ForbiddenException();
    }

    try {
      await user.$add('favorite_dishes', dish_id);
    } catch {
      throw new ForbiddenException();
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
      throw new ForbiddenException();
    }

    await user.$remove('favorite_dishes', dish_id);

    return true;
  }

  // todo: добавить лимит и тд
  public async getFavoriteDishes(user_id: number) {
    const user = await this.usersService.finUserById(user_id);

    if (user.is_partner) {
      throw new ForbiddenException();
    }

    return user.favorite_dishes;
  }

  public async getDishComments({ dish_id, ...data }: GetDishCommentsInput) {
    const commentsSum = await this.dishRatingModel.sum('stars');
    const comments: {
      rows: DishRating[];
      count: number;
      avarage_rating?: number;
    } = await this.dishRatingModel.findAndCountAll({
      where: {
        dish_id: dish_id,
      },
      ...data,
      distinct: true,
    });

    comments.avarage_rating = commentsSum / comments.count;

    return comments;
  }

  public async addCommentToDish(
    data: AddDishCommentsInput & { user_id: number },
  ) {
    const user = await this.usersService.finUserById(data.user_id);

    if (user.is_partner) {
      throw new ForbiddenException();
    }

    const comment = await this.dishRatingModel.findOne({
      where: {
        dish_id: data.dish_id,
        user_id: data.user_id,
      },
    });

    if (comment) {
      throw new BadRequestException('You already wrote review');
    }

    return this.dishRatingModel.create(data);
  }
}
