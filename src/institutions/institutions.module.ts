import { Module } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { InstitutionsResolver } from './institutions.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Institution } from './models/institution.model';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([Institution]), UsersModule],
  providers: [InstitutionsService, InstitutionsResolver],
})
export class InstitutionsModule {}
