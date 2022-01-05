import { Module } from '@nestjs/common';
import { FillingsService } from './fillings.service';
import { FillingsResolver } from './fillings.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Filling } from './models/filling.model';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, SequelizeModule.forFeature([Filling])],
  providers: [FillingsService, FillingsResolver],
})
export class FillingsModule {}
