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

@Module({
  imports: [
    SequelizeModule.forFeature([
      Institution,
      WorkDay,
      InstitutionPayMethod,
      FavoriteInstitutions,
    ]),
    UsersModule,
  ],
  providers: [InstitutionsService, InstitutionsResolver],
  exports: [InstitutionsService],
})
export class InstitutionsModule {}
