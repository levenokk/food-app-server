import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class UsersResolver {
  @Query(() => String)
  public async getUsers() {
    return 'users';
  }
}
