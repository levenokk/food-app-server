import { Args, Resolver, Query, ID, Mutation } from '@nestjs/graphql';
import { Institution } from './models/institution.model';
import { InstitutionsService } from './institutions.service';
import {
  GetInstitutionsInput,
  UpdateInstitutionsInput,
  CreateInstitutionsInput,
} from './dto/inputs';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/currentUser';
import { User } from '../users/models/user.model';

@Resolver(() => Institution)
export class InstitutionsResolver {
  constructor(private institutionsService: InstitutionsService) {}

  @Query(() => [Institution])
  public async getInstitutions(@Args('data') data: GetInstitutionsInput) {
    return this.institutionsService.getInstitutions(data);
  }

  @Query(() => Institution)
  public async getInstitution(
    @Args('id', {
      type: () => ID,
    })
    id: number,
  ) {
    return this.institutionsService.getInstitution(id);
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
  @Mutation(() => Institution)
  public async removeInstitution(@CurrentUser() user: User) {
    return this.institutionsService.removeInstitution(user.id);
  }
}
