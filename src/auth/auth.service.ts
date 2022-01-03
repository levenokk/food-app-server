import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/models/user.model';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(phone: string, code: number, is_partner: boolean) {
    const user = await this.usersService.findUserByPhone(phone, is_partner);

    if (!user || !user.code) {
      throw new BadRequestException('Invalid code');
    }

    const compareCode = bcrypt.compareSync(String(code), user.code);

    if (user && compareCode) {
      return this.login(user);
    }

    // todo: сделать более детальную обработку кода

    throw new BadRequestException('Invalid code');
  }

  async login(user: User) {
    const payload = { id: user.id };

    user.code = null;

    await user.save();

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
