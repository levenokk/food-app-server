import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  GetInstitutionsInput,
  UpdateInstitutionsInput,
  CreateInstitutionsInput,
} from './dto/inputs';
import { UsersService } from '../users/users.service';
import { WorkDay, Institution, InstitutionPayMethod } from './models';
import { Dish } from '../dishes/models/dish.model';
import { Tag } from '../tags/models';

@Injectable()
export class InstitutionsService {
  constructor(
    @InjectModel(Institution) private institutionModel: typeof Institution,
    @InjectModel(WorkDay) private workDayModel: typeof WorkDay,
    @InjectModel(InstitutionPayMethod)
    private institutionPayMethodModel: typeof InstitutionPayMethod,
    private usersService: UsersService,
  ) {}

  public async getInstitutions({
    offset,
    search,
    limit,
  }: GetInstitutionsInput) {
    const options: any = { offset, limit };

    if (search) {
      options.where = {
        name: search,
      };
    }

    return this.institutionModel.findAll({
      ...options,
      include: [WorkDay, Dish, Tag, InstitutionPayMethod],
    });
  }

  public async getInstitution(pk: number) {
    return this.institutionModel.findByPk(pk, {
      include: [WorkDay, Dish, Tag],
    });
  }

  public async createInstitutions({
    work_days,
    tags,
    pay_methods,
    ...data
  }: CreateInstitutionsInput & { user_id: number }) {
    const user = await this.usersService.finUserById(data.user_id);

    if (!user.is_partner) {
      throw new BadGatewayException();
    }

    const institution = await this.institutionModel.create(data, {
      include: [WorkDay, Dish, Tag, InstitutionPayMethod],
    });
    const days = work_days.map((day) => ({
      day: day,
      institution_id: institution.id,
    }));

    await institution.$set('tags', tags);
    await this.workDayModel.bulkCreate(days);

    const institutionPayMethods = pay_methods.map((method) => ({
      method,
      institution_id: institution.id,
    }));

    await this.institutionPayMethodModel.bulkCreate(institutionPayMethods);

    return institution;
  }

  public async updateInstitution({
    user_id,
    tags,
    work_days,
    pay_methods,
    ...data
  }: UpdateInstitutionsInput & { user_id: number }) {
    const institution = await this.institutionModel.findOne({
      where: {
        user_id: user_id,
      },
      include: [WorkDay, Dish, Tag, InstitutionPayMethod],
    });

    if (!institution) {
      throw new NotFoundException();
    }

    if (work_days) {
      await this.workDayModel.destroy({
        where: {
          institution_id: institution.id,
        },
      });

      const days = work_days.map((day) => ({
        day,
        institution_id: institution.id,
      }));

      await this.workDayModel.bulkCreate(days);
    }

    if (pay_methods) {
      await this.institutionPayMethodModel.destroy({
        where: {
          institution_id: institution.id,
        },
      });

      const institutionPayMethods = pay_methods.map((method) => ({
        method,
        institution_id: institution.id,
      }));

      await this.institutionPayMethodModel.bulkCreate(institutionPayMethods);
    }

    await institution.update(data);
    await institution.$set('tags', tags);

    return institution;
  }

  public async removeInstitution(user_id: number) {
    const user = await this.usersService.finUserById(user_id);

    if (!user.is_partner) {
      throw new BadGatewayException();
    }

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
