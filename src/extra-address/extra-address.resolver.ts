import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ExtraAddressService } from './extra-address.service';
import { ExtraAddress } from './models/extra.address.model';
import { CreateExtraAddressInput, UpdateExtraAddressInput } from './dto/inputs';

@Resolver(() => ExtraAddress)
export class ExtraAddressResolver {
  constructor(private extraAddressService: ExtraAddressService) {}

  @Mutation(() => ExtraAddress)
  public async addExtraAddress(@Args('data') data: CreateExtraAddressInput) {
    return this.extraAddressService.createExtraAddress(data);
  }

  @Mutation(() => ExtraAddress)
  public async updateExtraAddress(@Args('data') data: UpdateExtraAddressInput) {
    return this.extraAddressService.updateExtraAddress(data);
  }
}
