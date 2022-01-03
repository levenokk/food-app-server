import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UpdateUserInput, SendCodeInput } from './dto/inputs';
import { ExtraAddress } from '../extra-address/models/extra.address.model';
import * as bcrypt from 'bcryptjs';
import { Institution } from '../institutions/models/institution.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  public async finUserById(pk: number) {
    return this.userModel.findByPk(pk, {
      include: [Institution, ExtraAddress],
    });
  }

  public async findUserByPhone(phone: string, is_partner: boolean) {
    return this.userModel.findOne({
      where: {
        phone_number: phone,
        is_partner,
      },
      include: [Institution, ExtraAddress],
    });
  }

  public async updateUser({ id, ...data }: UpdateUserInput) {
    const user = await this.userModel.findByPk(id, {
      include: [Institution, ExtraAddress],
    });

    if (!user) {
      throw new NotFoundException();
    }

    await user.update({
      ...data,
      is_new: false,
    });

    return user;
  }

  public async sendCode({ phone, is_partner }: SendCodeInput) {
    let user = await this.userModel.findOne({
      where: {
        phone_number: phone,
        is_partner,
      },
    });

    if (!user) {
      user = await this.userModel.create({
        phone_number: phone,
        is_partner,
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const code = String(
      Math.floor(Math.pow(10, 6 - 1) + Math.random() * 9 * Math.pow(10, 6 - 1)),
    );

    // todo: Убрать потом
    console.log(code);

    user.code = bcrypt.hashSync(code, salt);

    await user.save();

    return true;
  }
}
