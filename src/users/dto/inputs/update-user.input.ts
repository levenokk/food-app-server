import { Field, InputType } from '@nestjs/graphql';

@InputType({
  description: 'Input for update user',
})
export class UpdateUserInput {
  id: number;

  @Field(() => String, {
    nullable: true,
  })
  name?: string;

  @Field(() => String, {
    nullable: true,
  })
  image?: string;

  @Field(() => Boolean, {
    nullable: true,
  })
  position: boolean;

  @Field(() => Boolean, {
    nullable: true,
  })
  notification?: boolean;
}
