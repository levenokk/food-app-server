import { Module } from '@nestjs/common';
import { ExtraAddressResolver } from './extra-address.resolver';
import { ExtraAddressService } from './extra-address.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ExtraAddress } from './models/extra.address.model';

@Module({
  imports: [SequelizeModule.forFeature([ExtraAddress])],
  providers: [ExtraAddressResolver, ExtraAddressService],
})
export class ExtraAddressModule {}
