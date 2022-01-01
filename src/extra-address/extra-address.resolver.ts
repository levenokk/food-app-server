import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { ExtraAddressService } from './extra-address.service';
import { ExtraAddress } from './models/extra.address.model';
import { CreateExtraAddressInput, UpdateExtraAddressInput } from './dto/inputs';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/currentUser';
import { User } from '../users/models/user.model';

@Resolver(() => ExtraAddress)
export class ExtraAddressResolver {
  constructor(private extraAddressService: ExtraAddressService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ExtraAddress)
  public async addExtraAddress(
    @CurrentUser() user: User,
    @Args('data') data: CreateExtraAddressInput,
  ) {
    return this.extraAddressService.createExtraAddress({
      ...data,
      user_id: user.id,
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ExtraAddress)
  public async updateExtraAddress(
    @CurrentUser() user: User,
    @Args('data') data: UpdateExtraAddressInput,
  ) {
    return this.extraAddressService.updateExtraAddress({
      ...data,
      user_id: user.id,
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ExtraAddress)
  public async removeExtraAddress(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: number,
  ) {
    return this.extraAddressService.removeExtraAddress(id, user.id);
  }
}
