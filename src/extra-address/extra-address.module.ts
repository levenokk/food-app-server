import { Module } from '@nestjs/common';
import { ExtraAddressResolver } from './extra-address.resolver';
import { ExtraAddressService } from './extra-address.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserExtraAddress, InstitutionExtraAddress } from './models';
import { UsersModule } from '../users/users.module';
import { InstitutionsModule } from '../institutions/institutions.module';

@Module({
  imports: [
    UsersModule,
    InstitutionsModule,
    SequelizeModule.forFeature([UserExtraAddress, InstitutionExtraAddress]),
  ],
  providers: [ExtraAddressResolver, ExtraAddressService],
})
export class ExtraAddressModule {}
