import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InstitutionExtraAddress, UserExtraAddress } from './models';
import { CreateExtraAddressInput, UpdateExtraAddressInput } from './dto/inputs';
import { UsersService } from '../users/users.service';

@Injectable()
export class ExtraAddressService {
  constructor(
    @InjectModel(UserExtraAddress)
    private userExtraAddressModel: typeof UserExtraAddress,
    @InjectModel(InstitutionExtraAddress)
    private institutionExtraAddressModel: typeof InstitutionExtraAddress,
    private usersService: UsersService,
  ) {}

  public async createUserExtraAddress(
    data: CreateExtraAddressInput & { user_id: number },
  ) {
    return this.userExtraAddressModel.create(data);
  }

  public async updateUserExtraAddress({
    id,
    user_id,
    ...data
  }: UpdateExtraAddressInput & { user_id: number }) {
    const address = await this.userExtraAddressModel.findByPk(id);

    if (address.user_id !== user_id) {
      throw new ForbiddenException();
    }

    await address.update(data);

    return address;
  }

  public async removeUserExtraAddress(pk: number, user_id: number) {
    const address = await this.userExtraAddressModel.findByPk(pk);

    if (address.user_id === user_id) {
      await address.destroy();

      return address;
    }

    throw new ForbiddenException();
  }

  public async createInstitutionExtraAddress({
    user_id,
    ...data
  }: CreateExtraAddressInput & { user_id: number }) {
    const user = await this.usersService.finUserById(user_id);

    if (!user.is_partner) {
      throw new ForbiddenException();
    }

    return this.institutionExtraAddressModel.create({
      ...data,
      institution_id: user.institution.id,
    });
  }

  public async updateInstitutionExtraAddress({
    id,
    user_id,
    ...data
  }: UpdateExtraAddressInput & { user_id: number }) {
    const user = await this.usersService.finUserById(user_id);

    if (!user.is_partner) {
      throw new ForbiddenException();
    }

    const address = await this.institutionExtraAddressModel.findByPk(id);

    if (address.institution_id !== user.institution.id) {
      throw new ForbiddenException();
    }

    await address.update(data);

    return address;
  }

  public async removeInstitutionExtraAddress(pk: number, user_id: number) {
    const user = await this.usersService.finUserById(user_id);

    if (!user.is_partner) {
      throw new ForbiddenException();
    }

    const address = await this.institutionExtraAddressModel.findByPk(pk);

    if (address.institution_id === user.institution.id) {
      await address.destroy();

      return address;
    }

    throw new ForbiddenException();
  }
}
