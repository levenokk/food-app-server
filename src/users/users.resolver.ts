import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './models';
import { UpdateUserInput } from './dto/inputs';
import { CurrentUser } from '../auth/decorators/currentUser';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  public async getCurrentUser(@CurrentUser() user: User) {
    return this.usersService.finUserById(user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  public async updateUser(
    @CurrentUser() user: User,
    @Args('data') data: UpdateUserInput,
  ) {
    return this.usersService.updateUser({ ...data, id: user.id });
  }
}
