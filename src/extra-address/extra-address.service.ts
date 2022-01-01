import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ExtraAddress } from './models/extra.address.model';
import { CreateExtraAddressInput, UpdateExtraAddressInput } from './dto/inputs';

@Injectable()
export class ExtraAddressService {
  constructor(
    @InjectModel(ExtraAddress)
    private extraAddressModel: typeof ExtraAddress,
  ) {}

  public async createExtraAddress(data: CreateExtraAddressInput) {
    // todo: сделать получения id с токена авторизации
    return this.extraAddressModel.create(data);
  }

  public async updateExtraAddress({
    id,
    user_id,
    ...data
  }: UpdateExtraAddressInput) {
    // todo: сделать получения id с токена авторизации

    const address = await this.extraAddressModel.findByPk(id);

    if (address.user_id !== user_id) {
      throw new ForbiddenException();
    }

    await address.update(data);

    return address;
  }

  // public async removeExtraAddress({id, useId}: {}) {
  //   const address = await this.extraAddressModel.findByPk()
  // }
}