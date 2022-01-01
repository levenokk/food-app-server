import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { CreateUserInput, UpdateUserInput } from './dto/inputs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  public async createUser(data: CreateUserInput) {
    const user = await this.userModel.create(data);
    // todo: добавить загрузку файлов
    user.image =
      'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg';

    await user.save();

    return user;
  }

  public async getUsers() {
    return this.userModel.findAll();
  }

  public async getUserById(pk: string) {
    return this.userModel.findByPk(pk);
  }

  public async updateUser({ id, ...data }: UpdateUserInput) {
    const user = await this.userModel.findByPk(id);

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
}
