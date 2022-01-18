import { Args, Resolver, Query, ID, Mutation } from '@nestjs/graphql';
import { Institution } from './models';
import { InstitutionsService } from './institutions.service';
import {
  GetInstitutionsInput,
  UpdateInstitutionsInput,
  CreateInstitutionsInput,
  AddInstitutionElevation,
} from './dto/inputs';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/currentUser';
import { User } from '../users/models';
import { InstitutionsObject } from './dto/objects';

@Resolver(() => Institution)
export class InstitutionsResolver {
  constructor(private institutionsService: InstitutionsService) {}

  @Query(() => InstitutionsObject)
  public async getInstitutions(@Args('data') data: GetInstitutionsInput) {
    return this.institutionsService.getInstitutions(data);
  }

  @Query(() => Institution)
  public async getInstitutionById(
    @Args('id', {
      type: () => ID,
    })
    id: number,
  ) {
    return this.institutionsService.getInstitutionById(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Institution)
  public async createInstitution(
    @CurrentUser() user: User,
    @Args('data')
    data: CreateInstitutionsInput,
  ) {
    return this.institutionsService.createInstitutions({
      user_id: user.id,
      ...data,
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Institution)
  public async updateInstitution(
    @CurrentUser() user: User,
    @Args('data')
    data: UpdateInstitutionsInput,
  ) {
    return this.institutionsService.updateInstitution({
      user_id: user.id,
      ...data,
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  public async removeInstitution(@CurrentUser() user: User) {
    return this.institutionsService.removeInstitution(user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  public async addInstitutionToFavorite(
    @CurrentUser() user: User,
    @Args('institution_id', {
      type: () => ID,
    })
    institution_id: number,
  ) {
    return this.institutionsService.addInstitutionToFavorite(
      institution_id,
      user.id,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  public async removeInstitutionFromFavorite(
    @CurrentUser() user: User,
    @Args('institution_id', {
      type: () => ID,
    })
    institution_id: number,
  ) {
    return this.institutionsService.removeInstitutionFromFavorite(
      institution_id,
      user.id,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Institution])
  public async getFavoriteInstitutions(@CurrentUser() user: User) {
    return this.institutionsService.getFavoriteInstitutions(user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Institution)
  public async getInstitution(@CurrentUser() user: User) {
    return this.institutionsService.getInstitution(user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  public async addInstitutionElevation(
    @Args('data') { institution_id, evaluation }: AddInstitutionElevation,
    @CurrentUser() user: User,
  ) {
    return this.institutionsService.addElevation(
      evaluation,
      institution_id,
      user.id,
    );
  }
}
