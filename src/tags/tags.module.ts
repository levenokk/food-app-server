import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsResolver } from './tags.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tag, InstitutionsTag } from './models/';

@Module({
  imports: [SequelizeModule.forFeature([Tag, InstitutionsTag])],
  providers: [TagsService, TagsResolver],
})
export class TagsModule {}
