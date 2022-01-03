import { Query, Resolver } from '@nestjs/graphql';
import { TagsService } from './tags.service';
import { Tag } from './models';

@Resolver(() => Tag)
export class TagsResolver {
  constructor(private tagsService: TagsService) {}

  @Query(() => [Tag])
  public async getTags() {
    return this.tagsService.getTags();
  }

  // @UseGuards(GqlAuthGuard)
  // @Mutation(() => Tag)
  // public async createTag(@Args('data') data: CreateTagInput) {
  //   return this.tagsService.createTag(data);
  // }
}
