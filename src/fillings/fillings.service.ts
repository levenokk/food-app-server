import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Filling } from './models';
import { GetFillingsInput } from './dto/inputs/get-fillings.input';
import { UsersService } from '../users/users.service';
import { CreateFillingInput } from './dto/inputs/create-filling.input';
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

    const image_url = await this.uploadService.uploadFile(image);

    return this.fillingModel.create({
      institution_id: institution.id,
      image: image_url,
      ...data,
    });
  }
}
