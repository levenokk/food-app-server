import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Filling } from './models';
import { GetFillingsInput, CreateFillingInput } from './dto/inputs';
import { UsersService } from '../users/users.service';
import { Sequelize } from 'sequelize-typescript';
import { InstitutionsService } from '../institutions/institutions.service';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class FillingsService {
  constructor(
    @InjectModel(Filling) private fillingModel: typeof Filling,
    private usersService: UsersService,
    private institutionsService: InstitutionsService,
    private uploadService: UploadService,
  ) {}

  public async getInstitutionFillings({ id, ...data }: GetFillingsInput) {
    return this.fillingModel.findAll({
      where: {
        institution_id: id,
      },
      ...data,
    });
  }

  public getFillingsById(ids: number[]) {
    return this.fillingModel.findAll({
      where: Sequelize.or({
        id: ids,
      }),
    });
  }

  public async createInstitutionFillings({
    user_id,
    image,
    ...data
  }: CreateFillingInput & { user_id: number }) {
    const user = await this.usersService.finUserById(user_id);
    const institution = await this.institutionsService.getInstitutionByUserId(
      user_id,
    );

    if (!user.is_partner) {
      throw new ForbiddenException();
    }

    const image_url = await this.uploadService.uploadFile(await image);

    return this.fillingModel.create({
      institution_id: institution.id,
      image: image_url,
      ...data,
    });
  }

  public async removeFilling(id: number, user_id: number) {
    const filling = await this.fillingModel.findByPk(id);
    const user = await this.usersService.finUserById(user_id);

    if (!user.is_partner) {
      throw new ForbiddenException();
    }

    if (!filling) {
      throw new NotFoundException();
    }

    console.log(filling.institution_id, user.institution.id);

    if (filling.institution_id !== user.institution.id) {
      throw new ForbiddenException();
    }

    await this.uploadService.removeFile(filling.image);
    await filling.destroy();

    return true;
  }
}
