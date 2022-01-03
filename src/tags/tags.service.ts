import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tag } from './models';
import { CreateTagInput } from './dto/inputs';

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag) private tagModel: typeof Tag) {}

  public async getTags() {
    return this.tagModel.findAll();
  }

  public async createTag(data: CreateTagInput) {
    return this.tagModel.create(data);
  }
}
