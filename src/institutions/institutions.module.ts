import { Module } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { InstitutionsResolver } from './institutions.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Institution, InstitutionPayMethod, WorkDay } from './models';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Institution, WorkDay, InstitutionPayMethod]),
    UsersModule,
  ],
  providers: [InstitutionsService, InstitutionsResolver],
})
export class InstitutionsModule {}
