import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UsersService } from '../users/users.service';
import { SendCodeInput } from '../users/dto/inputs';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/inputs';
import { Token } from './dto/objects';

@Resolver()
export class AuthResolver {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Mutation(() => Boolean)
  public async sendCode(@Args('data') data: SendCodeInput) {
    return this.usersService.sendCode(data);
  }

  @Query(() => Token)
  public async login(@Args('data') { phone, code, is_partner }: LoginInput) {
    return this.authService.validateUser(phone, code, is_partner);
  }
}
