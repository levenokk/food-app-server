import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { ExtraAddressService } from './extra-address.service';
import { UserExtraAddress, InstitutionExtraAddress } from './models';
import { CreateExtraAddressInput, UpdateExtraAddressInput } from './dto/inputs';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/currentUser';
import { User } from '../users/models/user.model';

@Resolver()
export class ExtraAddressResolver {
  constructor(private extraAddressService: ExtraAddressService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserExtraAddress)
  public async addUserExtraAddress(
    @CurrentUser() user: User,
    @Args('data') data: CreateExtraAddressInput,
  ) {
    return this.extraAddressService.createUserExtraAddress({
      ...data,
      user_id: user.id,
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserExtraAddress)
  public async updateUserExtraAddress(
    @CurrentUser() user: User,
    @Args('data') data: UpdateExtraAddressInput,
  ) {
    return this.extraAddressService.updateUserExtraAddress({
      ...data,
      user_id: user.id,
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserExtraAddress)
  public async removeUserExtraAddress(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: number,
  ) {
    return this.extraAddressService.removeUserExtraAddress(id, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => InstitutionExtraAddress)
  public async addInstitutionExtraAddress(
    @CurrentUser() user: User,
    @Args('data') data: CreateExtraAddressInput,
  ) {
    return this.extraAddressService.createInstitutionExtraAddress({
      ...data,
      user_id: user.id,
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => InstitutionExtraAddress)
  public async updateInstitutionExtraAddress(
    @CurrentUser() user: User,
    @Args('data') data: UpdateExtraAddressInput,
  ) {
    return this.extraAddressService.updateInstitutionExtraAddress({
      ...data,
      user_id: user.id,
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => InstitutionExtraAddress)
  public async removeInstitutionExtraAddress(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: number,
  ) {
    return this.extraAddressService.removeInstitutionExtraAddress(id, user.id);
  }
}
