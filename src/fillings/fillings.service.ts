import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Filling } from './models/filling.model';
import { GetFillingsInput } from './dto/inputs/get-fillings.input';
import { UsersService } from '../users/users.service';
import { CreateFillingInput } from './dto/inputs/create-filling.input';

@Injectable()
export class FillingsService {
  constructor(
    @InjectModel(Filling) private fillingModel: typeof Filling,
    private usersService: UsersService,
  ) {}

  public async getInstitutionFillings({ id, ...data }: GetFillingsInput) {
    return this.fillingModel.findAll({
      where: {
        institution_id: id,
      },
      ...data,
    });
  }

  public async createInstitutionFillings({
    user_id,
    ...data
  }: CreateFillingInput & { user_id: number }) {
    const user = await this.usersService.finUserById(user_id);

    if (!user.is_partner) {
      throw new BadGatewayException();
    }

    return this.fillingModel.create({
      institution_id: user.institution.id,
      ...data,
    });
  }
}
