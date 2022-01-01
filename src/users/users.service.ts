import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { CreateUserInput, UpdateUserInput, SendCodeInput } from './dto/inputs';
import { ExtraAddress } from '../extra-address/models/extra.address.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  public async createUser(data: CreateUserInput) {
    const isUserExists = await this.userModel.findOne({
      where: {
        phone_number: data.phone_number,
        is_partner: data.is_partner,
      },
    });

    if (isUserExists) {
      throw new BadRequestException('User is exists');
    }

    const user = await this.userModel.create(data, {
      include: [ExtraAddress],
    });
    // todo: добавить загрузку файлов
    user.image =
      'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg';

    await user.save();

    return user;
  }

  public async getUsers() {
    return this.userModel.findAll({
      include: [ExtraAddress],
    });
  }

  public async finUserById(pk: string) {
    return this.userModel.findByPk(pk, {
      include: [ExtraAddress],
    });
  }

  public async findUserByPhone(phone: string, is_partner: boolean) {
    return this.userModel.findOne({
      where: {
        phone_number: phone,
        is_partner,
      },
    });
  }

  public async updateUser({ id, ...data }: UpdateUserInput) {
    const user = await this.userModel.findByPk(id, {
      include: [ExtraAddress],
    });

    if (!user) {
      throw new NotFoundException();
    }

    // todo: сделать получения id по токену авторизации

    await user.update({
      ...data,
    });

    return user;
  }

  public async removeUser(pk: string) {
    // todo: сделать получения id по токену авторизации

    const user = await this.userModel.findByPk(pk);

    if (!user) {
      throw new NotFoundException();
    }

    await user.destroy();

    return true;
  }

  public async sendCode({ phone, is_partner }: SendCodeInput) {
    const user = await this.userModel.findOne({
      where: {
        phone_number: phone,
        is_partner,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    user.code = Math.floor(
      Math.pow(10, 6 - 1) + Math.random() * 9 * Math.pow(10, 6 - 1),
    );

    await user.save();

    return true;
  }
}
