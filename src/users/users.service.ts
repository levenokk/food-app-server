import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UpdateUserInput, SendCodeInput } from './dto/inputs';
import { UserExtraAddress } from '../extra-address/models';
import * as bcrypt from 'bcryptjs';
import {
  Institution,
  InstitutionPayMethod,
  WorkDay,
} from '../institutions/models';
import { Dish } from '../dishes/models';
import { Tag } from '../tags/models';
import { Filling } from '../fillings/models';
import { InstitutionOrder } from '../orders/models';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  public async finUserById(pk: number) {
    return this.userModel.findByPk(pk, {
      include: [
        {
          model: Institution,
          include: [WorkDay, Dish, Tag, InstitutionPayMethod, Filling],
        },
        InstitutionOrder,
        UserExtraAddress,
        Dish,
      ],
    });
  }

  public async findUserByPhone(phone: string, is_partner: boolean) {
    return this.userModel.findOne({
      where: {
        phone_number: phone,
        is_partner,
      },
      include: [
        {
          model: Institution,
          include: [WorkDay, Dish, Tag, InstitutionPayMethod, Filling],
        },
        UserExtraAddress,
        Dish,
      ],
    });
  }

  public async updateUser({ id, ...data }: UpdateUserInput) {
    const user = await this.userModel.findByPk(id, {
      include: [
        {
          model: Institution,
          include: [WorkDay, Dish, Tag, InstitutionPayMethod, Filling],
        },
        UserExtraAddress,
        Dish,
      ],
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
