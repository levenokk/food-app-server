import { Module } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { InstitutionsResolver } from './institutions.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  Institution,
  InstitutionPayMethod,
  WorkDay,
  FavoriteInstitutions,
} from './models';
import { UsersModule } from '../users/users.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Institution,
      WorkDay,
      InstitutionPayMethod,
      FavoriteInstitutions,
    ]),
    UsersModule,
    UploadModule,
  ],
  providers: [InstitutionsService, InstitutionsResolver],
  exports: [InstitutionsService],
})
export class InstitutionsModule {}
