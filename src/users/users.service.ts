import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserPay } from './models';
import { UpdateUserInput, SendCodeInput } from './dto/inputs';
import { UserExtraAddress } from '../extra-address/models';
import * as bcrypt from 'bcryptjs';
import {
  Institution,
  InstitutionPayMethod,
  WorkDay,
} from '../institutions/models';
import { Dish } from '../dishes/models';
import { Tag } from '../tags/models';
import { Filling } from '../fillings/models';
import { InstitutionOrder } from '../orders/models';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(UserPay) private userPayModel: typeof UserPay,
    private uploadService: UploadService,
  ) {}

  public async finUserById(pk: number) {
    return this.userModel.findByPk(pk, {
      include: [
        {
          model: Institution,
          as: 'favorite_institutions',
          include: [WorkDay, Dish, Tag, InstitutionPayMethod, Filling],
        },
        {
          model: Institution,
          as: 'institution',
          include: [WorkDay, Dish, Tag, InstitutionPayMethod, Filling],
        },
        InstitutionOrder,
        UserExtraAddress,
        Dish,
        UserPay,
      ],
    });
  }

  public async findUserByPhone(phone: string, is_partner: boolean) {
    return this.userModel.findOne({
      where: {
        phone_number: phone,
        is_partner,
      },
      include: [
        {
          model: Institution,
          as: 'favorite_institutions',
          include: [WorkDay, Dish, Tag, InstitutionPayMethod, Filling],
        },
        {
          model: Institution,
          as: 'institution',
          include: [WorkDay, Dish, Tag, InstitutionPayMethod, Filling],
        },
        UserExtraAddress,
        Dish,
        UserPay,
      ],
    });
  }

  public async updateUser({
    id,
    pay_methods,
    image,
    ...data
  }: UpdateUserInput) {
    const user = await this.userModel.findByPk(id, {
      include: [
        {
          model: Institution,
          as: 'favorite_institutions',
          include: [WorkDay, Dish, Tag, InstitutionPayMethod, Filling],
        },
        {
          model: Institution,
          as: 'institution',
          include: [WorkDay, Dish, Tag, InstitutionPayMethod, Filling],
        },
        UserExtraAddress,
        Dish,
        UserPay,
      ],
    });

    if (!user) {
      throw new NotFoundException();
    }

    if (pay_methods) {
      await this.userPayModel.destroy({
        where: {
          user_id: id,
        },
      });

      const filteredPayMethods = Array.from(new Set(pay_methods));
      const userPayMethods = filteredPayMethods.map((method) => ({
        method,
        user_id: id,
      }));

      await this.userPayModel.bulkCreate(userPayMethods);
    }

    let image_url = user.image;

    if (!image && !user.image) {
      throw new BadRequestException();
    }

    if (image) {
      image_url = await this.uploadService.uploadFile(await image);

      await this.uploadService.removeFile(user.image);
    }

    await user.update({
      ...data,
      is_new: false,
      image: image_url,
    });

    return user.reload();
  }

  public async sendCode({ phone, is_partner }: SendCodeInput) {
    let user = await this.userModel.findOne({
      where: {
        phone_number: phone,
        is_partner,
      },
    });

    if (!user) {
      user = await this.userModel.create({
        phone_number: phone,
        is_partner,
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const code = String(
      Math.floor(Math.pow(10, 6 - 1) + Math.random() * 9 * Math.pow(10, 6 - 1)),
    );

    // todo: Убрать потом
    console.log(code);

    user.code = bcrypt.hashSync(code, salt);

    await user.save();

    return true;
  }
}
