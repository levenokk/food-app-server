import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { CreateUserInput, UpdateUserInput } from './dto/inputs';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User])
  public async getUsers() {
    return this.usersService.getUsers();
  }

  @Query(() => User)
  public async getUser(
    @Args('id', {
      type: () => ID,
    })
    pk: string,
  ) {
    return this.usersService.getUserById(pk);
  }

  @Mutation(() => User)
  public async createUser(@Args('data') data: CreateUserInput) {
    return this.usersService.createUser(data);
  }

  @Mutation(() => User)
  public async updateUser(@Args('data') data: UpdateUserInput) {
    return this.usersService.updateUser(data);
  }

  @Mutation(() => Boolean)
  public async removeUser(
    @Args('id', {
      type: () => ID,
    })
    pk: string,
  ) {
    return this.usersService.removeUser(pk);
  }
}
