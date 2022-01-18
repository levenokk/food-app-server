import { Args, Resolver, Query, Mutation, ID } from '@nestjs/graphql';
import { FillingsService } from './fillings.service';
import { GetFillingsInput } from './dto/inputs/get-fillings.input';
import { Filling } from './models';
import { CreateFillingInput } from './dto/inputs/create-filling.input';
import { CurrentUser } from '../auth/decorators/currentUser';
import { User } from '../users/models/user.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver()
export class FillingsResolver {
  constructor(private fillingsService: FillingsService) {}

  @Query(() => [Filling], {
    defaultValue: [],
  })
  public async getInstitutionFillings(@Args('data') data: GetFillingsInput) {
    return this.fillingsService.getInstitutionFillings(data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Filling, {
    defaultValue: [],
  })
  public async createInstitutionFillings(
    @CurrentUser() user: User,
    @Args('data') data: CreateFillingInput,
  ) {
    return this.fillingsService.createInstitutionFillings({
      ...data,
      user_id: user.id,
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  public async removeInstitutionFilling(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: number,
  ) {
    return this.fillingsService.removeFilling(id, user.id);
  }
}
