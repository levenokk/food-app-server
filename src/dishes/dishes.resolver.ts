import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Dish } from './models/dish.model';
import { DishesService } from './dishes.service';
import { CreateDishInput, GetDishesInput, UpdateDishInput } from './dto/inputs';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver(() => Dish)
export class DishesResolver {
  constructor(private dishesService: DishesService) {}

  @Query(() => [Dish])
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
    @Args('data')
    data: CreateDishInput,
  ) {
    return this.dishesService.createDish(data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Dish)
  public async updateDish(
    @Args('data')
    data: UpdateDishInput,
  ) {
    return this.dishesService.updateDish(data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Dish)
  public async removeDish(
    @Args('id', {
      type: () => ID,
    })
    id: number,
  ) {
    return this.dishesService.removeDish(id);
  }
}
