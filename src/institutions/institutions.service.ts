import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Institution } from './models/institution.model';
import {
  GetInstitutionsInput,
  UpdateInstitutionsInput,
  CreateInstitutionsInput,
} from './dto/inputs';

@Injectable()
export class InstitutionsService {
  constructor(
    @InjectModel(Institution) private institutionModel: typeof Institution,
  ) {}

  public async getInstitutions({
    offset,
    search,
    limit,
  }: GetInstitutionsInput) {
    return this.institutionModel.findAll({
      offset,
      limit,
      where: {
        name: search,
      },
    });
  }

  public async getInstitution(pk: number) {
    return this.institutionModel.findByPk(pk);
  }

  public async createInstitutions(
    data: CreateInstitutionsInput & { user_id: number },
  ) {
    return this.institutionModel.create(data);
  }

  public async updateInstitution({
    user_id,
    ...data
  }: UpdateInstitutionsInput & { user_id: number }) {
    const institution = await this.institutionModel.findOne({
      where: {
        user_id: user_id,
      },
    });

    if (!institution) {
      throw new NotFoundException();
    }

    await institution.update(data);

    return institution;
  }

  public async removeInstitution(user_id: number) {
    const institution = await this.institutionModel.findOne({
      where: {
        user_id,
      },
    });

    if (!institution) {
      throw new NotFoundException();
    }

    await institution.destroy();

    return true;
  }
}
