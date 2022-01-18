import {
  ForbiddenException,
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
import {
  WorkDay,
  Institution,
  InstitutionPayMethod,
  InstitutionEvaluation,
} from './models';
import { Dish } from '../dishes/models';
import { Tag } from '../tags/models';
import { Filling } from '../fillings/models';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class InstitutionsService {
  constructor(
    @InjectModel(Institution) private institutionModel: typeof Institution,
    @InjectModel(WorkDay) private workDayModel: typeof WorkDay,
    @InjectModel(InstitutionEvaluation)
    private institutionEvaluationModel: typeof InstitutionEvaluation,
    @InjectModel(InstitutionPayMethod)
    private institutionPayMethodModel: typeof InstitutionPayMethod,
    private usersService: UsersService,
    private uploadService: UploadService,
  ) {}

  public async getInstitutionsById(ids: number[]) {
    return this.institutionModel.findAll({
      where: Sequelize.or({
        id: ids,
      }),
    });
  }

  public async getInstitutions({ search, ...data }: GetInstitutionsInput) {
    const options: any = data;

    if (search) {
      options.where = {
        [Op.and]: [
          {
            name: {
              [Op.iLike]: `%${search}%`,
            },
          },
        ],
      };
    }

    return this.institutionModel.findAndCountAll({
      ...options,
      include: [
        WorkDay,
        {
          include: [Tag],
          model: Dish,
        },
        Tag,
        InstitutionPayMethod,
        Filling,
      ],
      distinct: true,
    });
  }

  public async getInstitutionById(pk: number) {
    return this.institutionModel.findByPk(pk, {
      include: [
        WorkDay,
        {
          include: [Tag],
          model: Dish,
        },
        Tag,
        InstitutionPayMethod,
        Filling,
      ],
    });
  }

  public async createInstitutions({
    work_days,
    tags,
    pay_methods,
    image,
    ...data
  }: CreateInstitutionsInput & { user_id: number }) {
    const user = await this.usersService.finUserById(data.user_id);

    if (!user.is_partner) {
      throw new ForbiddenException();
    }

    if (user.institution) {
      throw new ForbiddenException();
    }

    const image_url = await this.uploadService.uploadFile(await image);

    const institution = await this.institutionModel.create(
      { ...data, image: image_url },
      {
        include: [
          WorkDay,
          {
            include: [Tag],
            model: Dish,
          },
          Tag,
          InstitutionPayMethod,
          Filling,
        ],
      },
    );
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

    return institution.reload();
  }

  public async updateInstitution({
    user_id,
    tags,
    work_days,
    pay_methods,
    image,
    ...data
  }: UpdateInstitutionsInput & { user_id: number }) {
    const institution = await this.institutionModel.findOne({
      where: {
        user_id: user_id,
      },
      include: [
        WorkDay,
        {
          include: [Tag],
          model: Dish,
        },
        Tag,
        InstitutionPayMethod,
        Filling,
      ],
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

    let image_url = institution.image;

    if (image) {
      image_url = await this.uploadService.uploadFile(await image);

      await this.uploadService.removeFile(institution.image);
    }

    await institution.update({ ...data, image: image_url });
    await institution.$set('tags', tags);

    return institution.reload();
  }

  public async removeInstitution(user_id: number) {
    const user = await this.usersService.finUserById(user_id);

    if (!user.is_partner) {
      throw new ForbiddenException();
    }

    const institution = await this.institutionModel.findOne({
      where: {
        user_id,
      },
    });

    if (!institution) {
      throw new NotFoundException();
    }

    await this.uploadService.removeFile(institution.image);
    await institution.destroy();

    return true;
  }

  public async addInstitutionToFavorite(
    institution_id: number,
    user_id: number,
  ) {
    const user = await this.usersService.finUserById(user_id);
    const institution = await this.institutionModel.findByPk(institution_id);

    if (user.is_partner) {
      throw new ForbiddenException();
    }

    if (!institution) {
      throw new NotFoundException();
    }

    try {
      await user.$add('favorite_institutions', institution_id);
    } catch {
      throw new ForbiddenException();
    }

    return true;
  }

  public async removeInstitutionFromFavorite(
    institution_id: number,
    user_id: number,
  ) {
    const user = await this.usersService.finUserById(user_id);
    const institution = await this.institutionModel.findByPk(institution_id);

    if (user.is_partner) {
      throw new ForbiddenException();
    }

    if (!institution) {
      throw new NotFoundException();
    }

    await user.$remove('favorite_institutions', institution_id);

    return true;
  }

  public async getFavoriteInstitutions(user_id: number) {
    const user = await this.usersService.finUserById(user_id);

    if (user.is_partner) {
      throw new ForbiddenException();
    }

    return user.favorite_institutions;
  }

  public async getInstitutionByUserId(user_id: number) {
    return this.institutionModel.findOne({
      where: {
        user_id,
      },
      include: [
        WorkDay,
        {
          include: [Tag],
          model: Dish,
        },
        Tag,
        InstitutionPayMethod,
        Filling,
      ],
    });
  }

  public async getInstitution(user_id: number) {
    const user = await this.usersService.finUserById(user_id);

    if (!user.is_partner) {
      throw new ForbiddenException();
    }

    return this.getInstitutionByUserId(user_id);
  }

  public async addElevation(
    evaluation: number,
    institution_id: number,
    user_id: number,
  ) {
    const user = await this.usersService.finUserById(user_id);

    if (user.is_partner) {
      throw new ForbiddenException();
    }

    const institution = await this.institutionModel.findByPk(institution_id);

    if (!institution) {
      throw new NotFoundException();
    }

    const institutionEvaluation = await this.institutionEvaluationModel.findOne(
      {
        where: {
          user_id,
        },
      },
    );

    if (institutionEvaluation) {
      throw new ForbiddenException();
    }

    await this.institutionEvaluationModel.create({
      evaluation,
      user_id,
      institution_id,
    });

    return true;
  }
}
