import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Dish, DishRating } from './models';
import { DishesService } from './dishes.service';
import {
  AddDishCommentsInput,
  CreateDishInput,
  GetDishCommentsInput,
  GetDishesInput,
  UpdateDishInput,
} from './dto/inputs';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/currentUser';
import { User } from '../users/models';
import { CommentsObject, DishesObject } from './dto/objects';

@Resolver()
export class DishesResolver {
  constructor(private dishesService: DishesService) {}

  @Query(() => DishesObject)
  public async getDishes(@Args('data') data: GetDishesInput) {
    return this.dishesService.getDishes(data);
  }

  @Query(() => Dish)
  public async getDish(
    @Args('id', {
      type: () => ID,
    })
    id: number,
  ) {
    return this.dishesService.getDish(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Dish)
  public async createDish(
    @CurrentUser() user: User,
    @Args('data')
    data: CreateDishInput,
  ) {
    return this.dishesService.createDish({ user_id: user.id, ...data });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Dish)
  public async updateDish(
    @CurrentUser() user: User,
    @Args('data')
    data: UpdateDishInput,
  ) {
    return this.dishesService.updateDish({ user_id: user.id, ...data });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Dish)
  public async removeDish(
    @CurrentUser() user: User,
    @Args('id', {
      type: () => ID,
    })
    id: number,
  ) {
    return this.dishesService.removeDish(id, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  public async addDishToFavorite(
    @CurrentUser() user: User,
    @Args('dish_id', {
      type: () => ID,
    })
    dish_id: number,
  ) {
    return this.dishesService.addDishToFavorite(dish_id, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  public async removeDishFromFavorite(
    @CurrentUser() user: User,
    @Args('dish_id', {
      type: () => ID,
    })
    dish_id: number,
  ) {
    return this.dishesService.removeFavoriteDish(dish_id, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Dish])
  public async getFavoriteDishes(@CurrentUser() user: User) {
    return this.dishesService.getFavoriteDishes(user.id);
  }

  @Query(() => CommentsObject)
  public async getDishComments(@Args('data') data: GetDishCommentsInput) {
    return this.dishesService.getDishComments(data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => DishRating)
  public async addDishComment(
    @Args('data') data: AddDishCommentsInput,
    @CurrentUser() user: User,
  ) {
    return this.dishesService.addCommentToDish({ ...data, user_id: user.id });
  }
}
