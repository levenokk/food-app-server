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
import { WorkDay, Institution } from './models';
import { Dish } from '../dishes/models/dish.model';
import { Tag } from '../tags/models';

@Injectable()
export class InstitutionsService {
  constructor(
    @InjectModel(Institution) private institutionModel: typeof Institution,
    @InjectModel(WorkDay) private workDayModel: typeof WorkDay,
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
      include: [WorkDay, Dish, Tag],
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
    ...data
  }: CreateInstitutionsInput & { user_id: number }) {
    const user = await this.usersService.finUserById(data.user_id);

    if (!user.is_partner) {
      throw new BadGatewayException();
    }

    const institution = await this.institutionModel.create(data, {
      include: [WorkDay, Dish, Tag],
    });
    const days = work_days.map((day) => ({
      day: day,
      institution_id: institution.id,
    }));

    await institution.$set('tags', tags);
    await this.workDayModel.bulkCreate(days);

    return institution;
  }

  public async updateInstitution({
    user_id,
    tags,
    work_days,
    ...data
  }: UpdateInstitutionsInput & { user_id: number }) {
    const institution = await this.institutionModel.findOne({
      where: {
        user_id: user_id,
      },
      include: [WorkDay, Dish, Tag],
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
        day: day,
        institution_id: institution.id,
      }));

      await this.workDayModel.bulkCreate(days);
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
