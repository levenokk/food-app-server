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

    const test = await this.institutionModel.findAll({
      ...options,
      include: [WorkDay],
    });

    console.log(test);

    return test;
  }

  public async getInstitution(pk: number) {
    return this.institutionModel.findByPk(pk, {
      include: [WorkDay],
    });
  }

  public async createInstitutions({
    work_days,
    ...data
  }: CreateInstitutionsInput & { user_id: number }) {
    const user = await this.usersService.finUserById(data.user_id);

    if (!user.is_partner) {
      throw new BadGatewayException();
    }

    const institution = await this.institutionModel.create(data);
    const days = work_days.map((day) => ({
      day: day,
      institution_id: institution.id,
    }));

    await this.workDayModel.bulkCreate(days);

    return institution;
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
