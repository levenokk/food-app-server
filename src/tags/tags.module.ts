import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsResolver } from './tags.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tag, InstitutionTag } from './models/';
import { DishTag } from './models/dish-tag.model';

@Module({
  imports: [SequelizeModule.forFeature([Tag, InstitutionTag, DishTag])],
  providers: [TagsService, TagsResolver],
})
export class TagsModule {}
