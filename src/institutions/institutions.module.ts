import { Module } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { InstitutionsResolver } from './institutions.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Institution } from './models/institution.model';

@Module({
  imports: [SequelizeModule.forFeature([Institution])],
  providers: [InstitutionsService, InstitutionsResolver],
})
export class InstitutionsModule {}
