import { Module } from '@nestjs/common';
import { FillingsService } from './fillings.service';
import { FillingsResolver } from './fillings.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Filling, DishFilling } from './models/';
import { UsersModule } from '../users/users.module';
import { InstitutionsModule } from '../institutions/institutions.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    UsersModule,
    InstitutionsModule,
    UploadModule,
    SequelizeModule.forFeature([Filling, DishFilling]),
  ],
  providers: [FillingsService, FillingsResolver],
  exports: [FillingsService],
})
export class FillingsModule {}
