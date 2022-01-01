import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/models/user.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(phone: string, code: number, is_partner: boolean) {
    const user = await this.usersService.findUserByPhone(phone, is_partner);

    if (user && user.code === code) {
      return this.login(user);
    }

    // todo: сделать более детальную обработку кода

    throw new BadRequestException('Invalid code');
  }

  async login(user: User) {
    const payload = { id: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
